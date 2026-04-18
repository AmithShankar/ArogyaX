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
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return trimTrailingSlash(envUrl);

  // Fallback for local development
  return trimTrailingSlash(API_DEV_ORIGIN);
}

export function getClientApiBaseUrl() {
  // Choice 2: Always return the full URL from env, no shorthand /api
  return getServerApiBaseUrl();
}
