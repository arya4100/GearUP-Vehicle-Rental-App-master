// src/pages/authentication/ResetPassword.js
// OWASP A02 – Cryptographic Failures:
//   Old code wrote the new plaintext password directly to Firestore.
//   Firebase Auth's sendPasswordResetEmail sends a signed, time-limited
//   email link — the password is hashed by Firebase and never exposed.
// OWASP A07 – Uses Firebase standard reset flow (no security question bypass).
// OWASP A03 – Email validated before calling Firebase.

import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { sendResetEmail }            from "../../security/authSecurity";
import { validateEmail }             from "../../security/inputSanitizer";
import { securityLog, SecurityEvents } from "../../security/securityLogger";

export default function ResetPassword() {
  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    // OWASP A03 – Validate email
    let safeEmail;
    try {
      safeEmail = validateEmail(email);
    } catch {
      setMsg("✗ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // OWASP A02 / A07 – Firebase sends a secure, time-limited reset link
    //                   No plaintext password is ever written to Firestore.
    const result = await sendResetEmail(safeEmail);

    if (result.success) {
      securityLog.info(SecurityEvents.AUTH.PASSWORD_RESET, "Password reset email sent");
      // Deliberately vague to prevent email enumeration (OWASP A07)
      setMsg("✓ If an account with that email exists, a reset link has been sent.");
    } else {
      setMsg("✓ If an account with that email exists, a reset link has been sent.");
      // Log internally but don't reveal whether the email exists to the user
      securityLog.warn(SecurityEvents.AUTH.PASSWORD_RESET, "Reset email send issue (may not exist)", {
        error: result.error,
      });
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email and we'll send you a secure reset link.</p>
      </div>

      <div className="login-right">
        <h2>Reset Password</h2>

        <form className="reset-form" onSubmit={handleSubmit}>
          <input
            id="reset-email"
            className="reset-input login-input"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-label="Email address"
            required
          />

          <button
            id="reset-submit-btn"
            className="login-btn"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>

          {msg && (
            <p
              className={msg.startsWith("✓") ? "success-text" : "error-text"}
              role="alert"
              aria-live="polite"
            >
              {msg}
            </p>
          )}
        </form>

        <p className="signup-link">
          <span onClick={() => navigate("/login")} role="button" tabIndex={0}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
