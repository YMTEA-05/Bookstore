export const BASE_URL = 'http://localhost:4000' // backend URL

// Add 'token' as an optional argument
async function request<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: headers,
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  // Handle 204 No Content (for DELETE)
  if (res.status === 204) {
    return null as T;
  }
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, token),
  post: <T>(path: string, body: unknown, token?: string) => 
    request<T>(path, token, { method: 'POST', body: JSON.stringify(body) }),
  
  // --- ADD THESE TWO ---
  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, token, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string, token?: string) =>
    request<T>(path, token, { method: 'DELETE' }),
}

export default api