const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(url: string, init?: RequestInit): Promise<T> {

  const maxRetries = 3;
  const retryDelayMs = 2000;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++){
    try{

      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...init,
      });

      if (!response.ok){
        if (response.status >= 500 && response.status < 600 && attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, retryDelayMs));
          continue;
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (err) {
      lastError = err;

      // network error (backend is not responding)
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, retryDelayMs));
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Unknown error during request');
}

export const httpClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
};
