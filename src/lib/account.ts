export type AccountUser = { id: string; email: string }
const TOKEN_KEY = 'onto.account.token'
const DEVICE_KEY = 'onto.account.device'

export function accountToken() { return localStorage.getItem(TOKEN_KEY) || '' }
export function saveAccount(token: string) { localStorage.setItem(TOKEN_KEY, token) }
export function clearAccount() { localStorage.removeItem(TOKEN_KEY) }
export function accountDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(DEVICE_KEY, id) }
  return id
}

export async function accountApi<T>(worker: string, path: string, init: RequestInit = {}): Promise<T> {
  const token = accountToken()
  const response = await fetch(`${worker}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(init.headers || {}) },
  })
  const result = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(result.error || 'Request failed. Please try again.')
  return result
}
