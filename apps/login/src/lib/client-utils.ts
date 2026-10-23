import { sanitizeUrl } from "@braintree/sanitize-url";

export type ServerActionResponse =
  | { redirect: string }
  | { error: string }
  | { samlData: { url: string; fields: Record<string, string> } }
  | undefined
  | null;

export function handleServerActionResponse(
  response: ServerActionResponse,
  router: { push: (url: string) => void },
  setSamlData: (data: { url: string; fields: Record<string, string> }) => void,
  setError: (error: string) => void,
): boolean {
  if (!response) {
    return false;
  }

  if ("redirect" in response && response.redirect) {
    if (isSafeRedirectUri(response.redirect)) {
      if (typeof window !== "undefined" && isExternalUrl(response.redirect)) {
        // External/custom-protocol URLs: use window.location for full navigation.
        // router.push() would trigger an RSC prefetch fetch() that gets blocked
        // by CSP connect-src 'self' for non-same-origin URLs.
        // CodeQL: This is safe — the URL is validated by isSafeRedirectUri above,
        // which blocks javascript:, data:, file:, blob:, and about: schemes.
        window.location.href = response.redirect; // lgtm[js/client-side-unvalidated-url-redirection]
      } else {
        router.push(response.redirect);
      }
      return true;
    } else {
      console.warn("handleServerActionResponse: Blocked unsafe redirect URI:", response.redirect);
      setError("Unsafe redirect URI was blocked");
      return true;
    }
  }

  if ("samlData" in response && response.samlData) {
    if (isSafeRedirectUri(response.samlData.url)) {
      setSamlData(response.samlData);
      return true;
    } else {
      console.warn("handleServerActionResponse: Blocked unsafe SAML post URL:", response.samlData.url);
      setError("Unsafe redirect URI was blocked");
      return true;
    }
  }

  if ("error" in response && response.error) {
    setError(response.error);
    return true;
  }

  return false;
}

/**
 * Resolve relative URLs against a fixed origin rather than trusting only the
 * leading slash: browsers treat /\\host as a network-path reference.
 * Keep relative URLs for our own routes and absolute custom schemes for
 * registered OIDC native-app callbacks.
 */
function isInternalPath(uri: string): boolean {
  if (!uri.startsWith("/") || uri.startsWith("//") || uri.includes("\\") || /[\u0000-\u001f\u007f]/.test(uri)) {
    return false;
  }

  try {
    const base = "https://zitadel.invalid";
    return new URL(uri, base).origin === base;
  } catch {
    return false;
  }
}

export function isExternalUrl(url: string): boolean {
  return !isInternalPath(url);
}

const SANITIZE_BLANK = "about:blank";
const EXTRA_BLOCKED = new Set(["file:", "blob:", "about:"]);

/**
 * Validates whether a given redirect URI is safe.
 * Supports safe internal paths and external OIDC/SAML callbacks, including
 * permitted native-app URI schemes. It rejects unsafe schemes and malformed
 * relative references without changing the protocol-level redirect contract.
 */
export function isSafeRedirectUri(uri: string): boolean {
  if (!uri) return false;

  // Only paths that stay on the Login origin may use client-side routing.
  if (isInternalPath(uri)) {
    return true;
  }

  // Never reinterpret a malformed path as an external OAuth callback.
  if (uri.startsWith("/") || uri.startsWith("\\")) {
    return false;
  }

  const sanitized = sanitizeUrl(uri);
  if (sanitized === SANITIZE_BLANK) return false;

  try {
    const parsed = new URL(sanitized);
    return !EXTRA_BLOCKED.has(parsed.protocol);
  } catch {
    return false;
  }
}
