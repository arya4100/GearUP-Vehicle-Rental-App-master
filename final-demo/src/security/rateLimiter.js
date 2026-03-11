/**
 * OWASP A07 – Identification and Authentication Failures
 * Client-side login rate limiter using localStorage.
 *
 * Stores attempt counts and lockout expiry in localStorage.
 * The server-side Firebase Security Rules provide the actual enforcement;
 * this layer improves UX and slows brute-force attacks from the browser.
 */

const MAX_ATTEMPTS  = 5;           // allowed failures before lockout
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes in milliseconds

const KEY_COUNT     = "gearup_fail_count";
const KEY_LOCKOUT   = "gearup_lockout_until";

/**
 * Returns { locked: true, remainingMs } if the user is currently locked out,
 * or { locked: false } if they may proceed.
 */
export function checkRateLimit() {
  const lockoutUntil = parseInt(localStorage.getItem(KEY_LOCKOUT) || "0", 10);
  const now = Date.now();

  if (lockoutUntil && now < lockoutUntil) {
    return { locked: true, remainingMs: lockoutUntil - now };
  }

  // Clear stale lockout
  if (lockoutUntil && now >= lockoutUntil) {
    clearRateLimit();
  }

  return { locked: false };
}

/**
 * Call after a FAILED login attempt.
 * Returns the updated attempt count and whether a lockout was just applied.
 */
export function recordFailedAttempt() {
  const current = parseInt(localStorage.getItem(KEY_COUNT) || "0", 10) + 1;
  localStorage.setItem(KEY_COUNT, String(current));

  if (current >= MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_MS;
    localStorage.setItem(KEY_LOCKOUT, String(lockoutUntil));
    return { count: current, lockedOut: true, lockoutUntil };
  }

  return { count: current, lockedOut: false, attemptsLeft: MAX_ATTEMPTS - current };
}

/**
 * Call after a SUCCESSFUL login to clear the counter.
 */
export function clearRateLimit() {
  localStorage.removeItem(KEY_COUNT);
  localStorage.removeItem(KEY_LOCKOUT);
}

/**
 * Human-readable countdown string, e.g. "14:32".
 */
export function formatRemainingTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
