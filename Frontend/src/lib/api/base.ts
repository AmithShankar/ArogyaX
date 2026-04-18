import { getServerApiBaseUrl } from "@/lib/app-config";
import { ApiEnvelope, ServerRequestOptions } from "@/types";
import { cookies } from "next/headers";
import { ServerApiError } from "./error";

const API_BASE_URL = getServerApiBaseUrl();

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !(value instanceof FormData);
}

function formatDetail(detail: string | Array<{ msg: string; loc: string[] }> | undefined): string | undefined {
  if (!detail) return undefined;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(", ");
  }
  return JSON.stringify(detail);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload: ApiEnvelope<T> | null = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const detail = payload?.detail;
    const message =
      payload?.errors?.[0]?.message ??
      formatDetail(detail) ??
      response.statusText ??
      "Request failed";
    throw new ServerApiError(message, response.status);
  }

  return (payload?.data ?? payload) as T;
}

export async function serverApi<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const cookieHeader = (await cookies()).toString();
  let body = options.body as BodyInit | null | undefined;

  if (isPlainObject(options.body)) {
    body = JSON.stringify(options.body);
    headers.set("content-type", "application/json");
  }

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export async function safeServerApi<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T | null> {
  try {
    return await serverApi<T>(path, options);
  } catch (error) {
    if (
      error instanceof ServerApiError &&
      (error.status === 404 || error.status === 401 || error.status === 403)
    ) {
      return null;
    }
    throw error;
  }
}
