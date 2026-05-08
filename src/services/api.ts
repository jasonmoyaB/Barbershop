export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message?: string };

const DEFAULT_TIMEOUT = 10000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function postJSON<TRequest, TResponse>(
  url: string,
  body: TRequest,
): Promise<ApiResponse<TResponse>> {
  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { ok: false, status: res.status, message: await res.text() };
    const data = (await res.json()) as TResponse;
    return { ok: true, data };
  } catch (err) {
    if ((err as DOMException)?.name === 'AbortError')
      return { ok: false, status: 408, message: 'timeout' };
    return { ok: false, status: 0, message: String(err) };
  }
}
