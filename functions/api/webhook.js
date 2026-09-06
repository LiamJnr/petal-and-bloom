export async function onRequestPost({ request, env }) {
  const rawBody = await request.text()
  const signature = request.headers.get('X-Signature') || ''
  const valid = await verifySignature(rawBody, signature, env.LEMONSQUEEZY_WEBHOOK_SECRET)
  if (!valid) return new Response('Invalid signature', { status: 401 })

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const eventName = event.meta?.event_name
  const orderRef = event.meta?.custom_data?.order_ref
  if (!orderRef) return new Response('OK', { status: 200 })

  if (eventName === 'order_created') {
    await env.DB.prepare(
      `UPDATE orders
       SET status = 'paid', ls_order_id = ?, paid_at = datetime('now')
       WHERE id = ? AND status = 'pending'`,
    ).bind(event.data?.id || null, orderRef).run()
  }

  if (eventName === 'order_refunded') {
    await env.DB.prepare(
      `UPDATE orders SET status = 'refunded' WHERE id = ?`,
    ).bind(orderRef).run()
  }

  return new Response('OK', { status: 200 })
}

async function verifySignature(rawBody, signatureHex, secret) {
  if (!signatureHex || !secret) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const macHex = [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  if (macHex.length !== signatureHex.length) return false

  let mismatch = 0
  for (let index = 0; index < macHex.length; index += 1) {
    mismatch |= macHex.charCodeAt(index) ^ signatureHex.charCodeAt(index)
  }
  return mismatch === 0
}
