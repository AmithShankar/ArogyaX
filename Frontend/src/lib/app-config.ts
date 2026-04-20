export const APP_NAME = "ArogyaX";
export const API_PROXY_PREFIX = "/api";
export const API_DEV_ORIGIN = "http://localhost:8000";
export const AUTH_COOKIE_NAME = "auth-token";
export const LOGIN_ROUTE = "/login";
export const UNAUTHORIZED_ROUTE = "/unauthorized";
export const DEFAULT_REDIRECT = "/dashboard";
export const PASSWORD_TYPE_COOKIE = "password-type";
export const THEME_STORAGE_KEY = "hpms-theme";

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function getServerApiBaseUrl() {
  // NEXT_PUBLIC_API_URL should point to the real backend URL
  // for server-to-server communication.
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return trimTrailingSlash(envUrl);

  return trimTrailingSlash(API_DEV_ORIGIN);
}

export function getClientApiBaseUrl() {
  // Use relative /api path in browser to take advantage of Vercel rewrites
  // and maintain same-origin cookie behavior and simplified CORS.
  if (typeof window !== "undefined") {
    // If we're on the custom domain (not localhost), use the proxy
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return API_PROXY_PREFIX;
    }
  }
  return getServerApiBaseUrl();
}
