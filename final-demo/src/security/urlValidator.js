/**
 * OWASP A04 – Insecure Design / A06 – Vulnerable & Outdated Components
 * OWASP A10 – Server-Side Request Forgery (SSRF) prevention
 *
 * Allowlist of trusted external image/resource origins.
 * All user-supplied URLs must be checked against this list before use.
 */

const TRUSTED_IMAGE_ORIGINS = [
  "https://firebasestorage.googleapis.com",
  "https://storage.googleapis.com",
  "https://lh3.googleusercontent.com",
  "https://upload.wikimedia.org",
  "https://www.shutterstock.com",
  "https://www.apple.com",
  "https://via.placeholder.com",
];

/**
 * Returns true if the given URL is from a trusted origin.
 * Use before rendering any user-supplied image src.
 */
export function isTrustedUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    // Block non-HTTPS schemes (javascript:, data:, file:, etc.)
    if (parsed.protocol !== "https:") return false;
    return TRUSTED_IMAGE_ORIGINS.some((origin) =>
      parsed.origin === origin || parsed.href.startsWith(origin)
    );
  } catch {
    return false;
  }
}

/**
 * Return a safe image src: the original if trusted, otherwise a placeholder.
 */
export function safeSrc(url, fallback = "https://via.placeholder.com/400x250?text=Image+Unavailable") {
  return isTrustedUrl(url) ? url : fallback;
}

/**
 * OWASP A03 – Prevent open-redirect attacks.
 * Only allow relative paths or paths within our own origin.
 */
export function isSafeRedirect(url) {
  if (!url) return false;
  // Allow relative paths starting with /
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const parsed = new URL(url);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}
