/**
 * OWASP A09 – Security Logging and Monitoring Failures
 *
 * Structured security event logger.
 * - Writes events to the browser console in a structured format.
 * - Persists a rolling window of events to sessionStorage so they
 *   survive navigation (cleared when the tab closes).
 * - Redacts sensitive fields before logging.
 *
 * For production you would forward WARN/ERROR events to a
 * server-side logging endpoint or a SIEM (e.g. Firebase Functions → Cloud Logging).
 */

const LOG_KEY   = "gearup_security_log";
const MAX_EVENTS = 200;

const SEVERITY = {
  INFO:  "INFO",
  WARN:  "WARN",
  ERROR: "ERROR",
};

/** Fields whose values must never appear in logs. */
const REDACTED_FIELDS = ["password", "cardNumber", "cvv", "cvc", "token", "secret"];

function redact(data) {
  if (!data || typeof data !== "object") return data;
  const safe = { ...data };
  REDACTED_FIELDS.forEach((f) => {
    if (f in safe) safe[f] = "***REDACTED***";
  });
  return safe;
}

function appendToStorage(event) {
  try {
    const existing = JSON.parse(sessionStorage.getItem(LOG_KEY) || "[]");
    existing.push(event);
    // Keep only the most-recent MAX_EVENTS entries
    const trimmed = existing.slice(-MAX_EVENTS);
    sessionStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage quota exceeded – silently skip
  }
}

function log(severity, category, message, data = {}) {
  const event = {
    timestamp: new Date().toISOString(),
    severity,
    category,
    message,
    data: redact(data),
    userAgent: navigator.userAgent,
    url: window.location.pathname,
  };

  const prefix = `[GearUP Security][${severity}][${category}]`;
  if (severity === SEVERITY.ERROR) {
    console.error(prefix, message, event.data);
  } else if (severity === SEVERITY.WARN) {
    console.warn(prefix, message, event.data);
  } else {
    console.info(prefix, message, event.data);
  }

  appendToStorage(event);
  return event;
}

// ─── Public API ────────────────────────────────────────────────────────────

export const securityLog = {
  /** Routine informational security events (login success, logout). */
  info: (category, message, data) => log(SEVERITY.INFO, category, message, data),

  /** Suspicious but not necessarily malicious events (too many failed logins). */
  warn: (category, message, data) => log(SEVERITY.WARN, category, message, data),

  /** Definite security failures (auth bypass attempt, injection detected). */
  error: (category, message, data) => log(SEVERITY.ERROR, category, message, data),

  /** Retrieve all events stored this session (for a security dashboard). */
  getEvents: () => {
    try {
      return JSON.parse(sessionStorage.getItem(LOG_KEY) || "[]");
    } catch {
      return [];
    }
  },

  /** Clear stored events (e.g. on logout). */
  clear: () => sessionStorage.removeItem(LOG_KEY),
};

// Named event helpers
export const SecurityEvents = {
  AUTH: {
    LOGIN_SUCCESS:       "LOGIN_SUCCESS",
    LOGIN_FAILED:        "LOGIN_FAILED",
    LOGOUT:              "LOGOUT",
    REGISTER_SUCCESS:    "REGISTER_SUCCESS",
    REGISTER_FAILED:     "REGISTER_FAILED",
    RATE_LIMIT_HIT:      "RATE_LIMIT_HIT",
    LOCKOUT_TRIGGERED:   "LOCKOUT_TRIGGERED",
    PASSWORD_RESET:      "PASSWORD_RESET",
  },
  ACCESS: {
    UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
    ROLE_MISMATCH:       "ROLE_MISMATCH",
    PROTECTED_ROUTE_HIT: "PROTECTED_ROUTE_HIT",
  },
  INPUT: {
    VALIDATION_FAILED:   "VALIDATION_FAILED",
    INJECTION_DETECTED:  "INJECTION_DETECTED",
  },
  PAYMENT: {
    PAYMENT_INITIATED:   "PAYMENT_INITIATED",
    PAYMENT_COMPLETED:   "PAYMENT_COMPLETED",
    PAYMENT_FAILED:      "PAYMENT_FAILED",
  },
};
