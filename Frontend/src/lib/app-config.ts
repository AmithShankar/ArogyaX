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
  return trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || API_DEV_ORIGIN);
}

export function getClientApiBaseUrl() {
  if (typeof window !== "undefined") {
    return API_PROXY_PREFIX;
  }

  return getServerApiBaseUrl();
}
