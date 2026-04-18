import { getClientApiBaseUrl, PASSWORD_TYPE_COOKIE } from "@/lib/app-config";
import { ApiEnvelope, RequestOptions } from "@/types";
import { ApiRequestError } from "./error";

const API_BASE_URL = getClientApiBaseUrl();
let forcedLogoutPromise: Promise<void> | null = null;

export function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function forceLogoutOnUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  if (!forcedLogoutPromise) {
    forcedLogoutPromise = (async () => {
      try {
        await fetch(buildUrl("/auth/logout"), {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      } catch {
        // Best-effort logout. Redirect still matters even if the network call fails.
      } finally {
        document.cookie = `${PASSWORD_TYPE_COOKIE}=; Max-Age=0; path=/`;
        window.location.replace("/login");
      }
    })();
  }

  await forcedLogoutPromise;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !(value instanceof FormData);
}

export function buildRequestInit(options: RequestOptions = {}): RequestInit {
  const headers = new Headers(options.headers);
  let body = options.body as BodyInit | null | undefined;

  if (isPlainObject(options.body)) {
    body = JSON.stringify(options.body);
    headers.set("content-type", "application/json");
  }

  // Simple CSRF protection: API should require this header to prevent cross-site requests
  headers.set("X-Requested-With", "XMLHttpRequest");

  return {
    ...options,
    headers,
    body,
    credentials: "include",
    cache: "no-store",
  };
}

export function formatDetail(detail: ApiEnvelope<any>["detail"]): string {
  if (!detail) return "Request failed";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.join(".") || "error"}: ${d.msg}`).join(", ");
  }
  return JSON.stringify(detail);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload: ApiEnvelope<T> | null = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitMsg = retryAfter ? ` in ${retryAfter} seconds` : "";
      throw new ApiRequestError(
        `Too many requests. Please try again${waitMsg}.`,
        429
      );
    }

    const message =
      payload?.errors?.[0]?.message ??
      formatDetail(payload?.detail) ??
      response.statusText ??
      "Request failed";

    throw new ApiRequestError(message, response.status);
  }

  return (payload?.data ?? payload) as T;
}

export async function clientApi<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await fetch(buildUrl(path), buildRequestInit(options));
  try {
    return await parseResponse<T>(response);
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      error.status === 401 &&
      !options?.skipAuthRedirect
    ) {
      await forceLogoutOnUnauthorized();
    }

    throw error;
  }
}
