import { authFetch } from './auth-fetch'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await authFetch(`${API_BASE}${url}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? `API error: ${res.status}`)
  }
  return res.json()
}
