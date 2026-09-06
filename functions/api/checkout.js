import { PRODUCTS } from '../../js/data/products.js'

const MAX_LINE_ITEMS = 25
const MAX_QUANTITY_PER_LINE = 20
const MAX_GIFT_NOTE_LENGTH = 250
const productBySlug = new Map(PRODUCTS.map((product) => [product.slug, product]))

export async function onRequestPost(context) {
  try {
    return await createCheckout(context)
  } catch (error) {
    console.error('Checkout creation failed', error)
    const isTestMode = String(context.env.LEMONSQUEEZY_TEST_MODE || '').trim().toLowerCase() === 'true'
    const message = isTestMode && error instanceof Error
      ? `Checkout setup error: ${error.message}`
      : 'Checkout could not be prepared. Please try again.'
    return json({ error: message }, 500)
  }
}

async function createCheckout({ request, env }) {
  const missing = ['DB', 'LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_STORE_ID', 'LEMONSQUEEZY_VARIANT_ID']
    .filter((key) => !env[key])
  if (missing.length) return json({ error: `Checkout is not configured: ${missing.join(', ')}` }, 500)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid checkout request.' }, 400)
  }

  let items
  let delivery
  try {
    items = validateItems(body.items)
    delivery = validateDelivery(body.delivery)
  } catch (error) {
    return json({ error: error.message }, 400)
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0)
  const totalCents = subtotalCents // Local florist delivery and the card note are currently complimentary.
  const orderId = crypto.randomUUID()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const siteUrl = new URL(request.url).origin
  const redirectUrl = `${siteUrl}/?view=order-confirmed&order=${encodeURIComponent(orderId)}`

  await env.DB.prepare(
    `INSERT INTO orders (id, status, purchaser_email, cart_json, delivery_json, total_cents)
     VALUES (?, 'pending', ?, ?, ?, ?)`
  ).bind(
    orderId,
    delivery.recipient_email,
    JSON.stringify(items),
    JSON.stringify(delivery),
    totalCents,
  ).run()

  const variantId = Number(env.LEMONSQUEEZY_VARIANT_ID)
  const testMode = String(env.LEMONSQUEEZY_TEST_MODE || '').trim().toLowerCase() === 'true'
  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        custom_price: totalCents,
        test_mode: testMode,
        product_options: {
          name: `Petal & Bloom order — ${itemCount} item${itemCount === 1 ? '' : 's'}`,
          description: checkoutDescription(items, delivery),
          enabled_variants: [variantId],
          redirect_url: redirectUrl,
          receipt_button_text: 'Return to Petal & Bloom',
          receipt_link_url: siteUrl,
        },
        checkout_data: {
          email: delivery.recipient_email,
          name: delivery.recipient_name,
          custom: { order_ref: orderId },
        },
      },
      relationships: {
        store: { data: { type: 'stores', id: String(env.LEMONSQUEEZY_STORE_ID) } },
        variant: { data: { type: 'variants', id: String(env.LEMONSQUEEZY_VARIANT_ID) } },
      },
    },
  }

  const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  })

  const checkoutData = await checkoutResponse.json().catch(() => null)
  const url = checkoutData?.data?.attributes?.url
  if (!checkoutResponse.ok || !url) {
    await env.DB.prepare(
      `UPDATE orders SET status = 'checkout_failed' WHERE id = ? AND status = 'pending'`,
    ).bind(orderId).run()
    return json({
      error: checkoutData?.errors?.[0]?.detail || 'Payment checkout could not be prepared. Please try again.',
    }, 502)
  }

  return json({ url })
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Your flower bag is empty.')
  if (items.length > MAX_LINE_ITEMS) throw new Error('Your flower bag has too many different items.')

  return items.map((item) => {
    const product = productBySlug.get(String(item?.slug || ''))
    const sizeId = String(item?.size_id || '').trim()
    const vaseId = String(item?.vase_id || '').trim()
    const quantity = Number(item?.quantity)
    if (!product) throw new Error('One of the arrangements in your bag is no longer available.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      throw new Error('Please choose a valid quantity for every arrangement.')
    }

    const size = product.sizes.find((option) => option.id === sizeId)
    const vase = product.vases.find((option) => option.id === vaseId)
    if (!size) throw new Error(`Please choose a valid size for ${product.name}.`)
    if (!vase) throw new Error(`Please choose a valid vase or wrap for ${product.name}.`)

    return {
      slug: product.slug,
      name: product.name,
      size: { id: size.id, name: size.name },
      vase: { id: vase.id, name: vase.name },
      quantity,
      unit_price_cents: Math.round((size.price + vase.price) * 100),
    }
  })
}

function validateDelivery(value) {
  const clean = (field, max) => String(value?.[field] || '').trim().slice(0, max)
  const recipient_email = clean('recipient_email', 254).toLowerCase()
  const delivery_date = clean('delivery_date', 10)
  const result = {
    recipient_name: clean('recipient_name', 100),
    recipient_email,
    line1: clean('line1', 160),
    line2: clean('line2', 160),
    city: clean('city', 100),
    state: clean('state', 100),
    zip: clean('zip', 30),
    location_type: clean('location_type', 20),
    courier_notes: clean('courier_notes', 500),
    delivery_date,
    time_window: clean('time_window', 20),
    gift_message: clean('gift_message', MAX_GIFT_NOTE_LENGTH),
  }

  const required = ['recipient_name', 'recipient_email', 'line1', 'city', 'state', 'zip', 'delivery_date']
  if (required.some((field) => !result[field])) throw new Error('Please complete all required recipient and delivery details.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.recipient_email)) throw new Error('Please enter a valid recipient email address.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.delivery_date) || result.delivery_date < todayInUtc()) {
    throw new Error('Please choose a valid future delivery date.')
  }
  if (!['residential', 'business', 'hospital', 'venue'].includes(result.location_type)) {
    throw new Error('Please choose a valid delivery location type.')
  }
  if (!['morning', 'afternoon', 'evening'].includes(result.time_window)) {
    throw new Error('Please choose a valid delivery time window.')
  }
  return result
}

function checkoutDescription(items, delivery) {
  const itemText = items
    .map((item) => `${item.name} — ${item.size.name}, ${item.vase.name} × ${item.quantity}`)
    .join('; ')
  return `${itemText}. Deliver ${delivery.delivery_date} (${delivery.time_window}).`.slice(0, 1000)
}

function todayInUtc() {
  return new Date().toISOString().slice(0, 10)
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
