export async function onRequestGet({ params, env }) {
  const id = String(params.id || '')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return json({ error: 'Invalid order reference.' }, 400)
  }

  const order = await env.DB.prepare(
    'SELECT id, status, total_cents, created_at, paid_at FROM orders WHERE id = ?',
  ).bind(id).first()

  if (!order) return json({ error: 'Order not found.' }, 404)
  return json({ order })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
