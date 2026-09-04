/**
 * Thin wrapper around FormZero's backend API. Keeping every fetch call in
 * one file means Person 3 (backend/integration) can change the API base URL
 * or auth handling without touching component code.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchAnswer({ question, type = 'text', options = [] }) {
  const response = await fetch(`${API_BASE}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, type, options }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`FormZero API error (${response.status}): ${detail}`)
  }

  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`)
  if (!response.ok) throw new Error('Backend health check failed')
  return response.json()
}
