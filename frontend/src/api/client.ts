const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof body.message === "string"
        ? body.message
        : "An unexpected error occurred";
    const error = new Error(message) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return body as T;
}
