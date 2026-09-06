export async function startCheckout({ items, buyer }) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, buyer }),
  })

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: 'Checkout could not be started.' }))
    throw new Error(error || 'Checkout could not be started.')
  }

  const { url } = await response.json()
  if (!url) throw new Error('Checkout could not be started.')
  window.location.assign(url)
}
