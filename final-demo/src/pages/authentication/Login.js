// src/pages/authentication/Login.js
// OWASP A07 – Rate limiting, A02 – Firebase Auth (no plaintext passwords),
// A09 – Security logging.

import React, { useState, useEffect } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";

import { secureLogin }                             from "../../security/authSecurity";
import { validateEmail }                           from "../../security/inputSanitizer";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  formatRemainingTime,
}                                                  from "../../security/rateLimiter";
import { securityLog, SecurityEvents }             from "../../security/securityLogger";

export default function Login() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [lockMsg,  setLockMsg]  = useState("");

  // Update lockout countdown every second if user is locked out
  useEffect(() => {
    const id = setInterval(() => {
      const { locked, remainingMs } = checkRateLimit();
      if (locked) {
        setLockMsg(`Account temporarily locked. Try again in ${formatRemainingTime(remainingMs)}.`);
      } else {
        setLockMsg("");
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogin = async () => {
    setError("");

    // OWASP A07 – Check rate limit before trying
    const { locked, remainingMs } = checkRateLimit();
    if (locked) {
      const msg = `Too many failed attempts. Try again in ${formatRemainingTime(remainingMs)}.`;
      setLockMsg(msg);
      securityLog.warn(SecurityEvents.AUTH.RATE_LIMIT_HIT, "Login blocked by rate limiter");
      return;
    }

    // OWASP A03 – Validate input
    let validEmail;
    try {
      validEmail = validateEmail(email);
    } catch {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      // OWASP A02 – Firebase Auth (not Firestore plaintext comparison)
      const result = await secureLogin(validEmail, password);

      if (!result.success) {
        const { count, lockedOut, attemptsLeft } = recordFailedAttempt();

        if (lockedOut) {
          securityLog.warn(
            SecurityEvents.AUTH.LOCKOUT_TRIGGERED,
            "Account locked after repeated failures",
            { count }
          );
          setLockMsg("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setError(`${result.error} (${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left)`);
        }
        return;
      }

      // Successful login — clear rate limiter
      clearRateLimit();

      // Redirect based on server-authoritative role
      const { role } = result;
      if (role === "Admin")    navigate("/admin-dashboard");
      else if (role === "CarOwner") navigate("/car-owner");
      else                     navigate("/dashboard");

    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to trigger login
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Kia Ora!</h1>
        <p>Welcome to <b>GearUP</b> — your one-stop platform for rental services.</p>
      </div>

      <div className="login-right">
        <h2>Welcome Back</h2>

        {/* OWASP A07 – Show lockout message */}
        {lockMsg && <p className="error-box" role="alert" aria-live="assertive">{lockMsg}</p>}
        {error   && <p className="error-box" role="alert" aria-live="polite">{error}</p>}

        {/* OWASP A03 – type="email" enables browser-level validation */}
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="username"
          aria-label="Email address"
          disabled={loading || !!lockMsg}
        />

        <input
          id="login-password"
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          aria-label="Password"
          disabled={loading || !!lockMsg}
        />

        <p className="forgot-password" onClick={() => navigate("/reset")} role="button" tabIndex={0}>
          Forgot Password?
        </p>

        <button
          id="login-submit-btn"
          className="login-btn"
          onClick={handleLogin}
          disabled={loading || !!lockMsg}
          aria-busy={loading}
        >
          {loading ? "Signing in…" : "Log In"}
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
