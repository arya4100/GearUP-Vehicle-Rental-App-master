// src/pages/authentication/Register.js
// OWASP A02 – Firebase Auth for secure password hashing,
// A03 – Input validation and sanitization,
// A07 – Strong password enforcement,
// A09 – Security logging.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

import { secureRegister }                      from "../../security/authSecurity";
import {
  sanitizeName,
  validateEmail,
  validatePhone,
  validatePasswordStrength,
}                                              from "../../security/inputSanitizer";
import { securityLog, SecurityEvents }         from "../../security/securityLogger";

export default function Register() {
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [role,     setRole]     = useState("User");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [pwStrength, setPwStrength] = useState({ valid: false, message: "" });

  const navigate = useNavigate();

  // Live password-strength feedback (OWASP A07)
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val) setPwStrength(validatePasswordStrength(val));
    else     setPwStrength({ valid: false, message: "" });
  };

  const handleRegister = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      // OWASP A03 – Validate and sanitize every field
      let safeName, safeEmail, safePhone;
      try {
        safeName  = sanitizeName(name);
        safeEmail = validateEmail(email);
        safePhone = validatePhone(phone);
      } catch (validationErr) {
        setErrorMsg(validationErr.message);
        setLoading(false);
        securityLog.warn(SecurityEvents.INPUT.VALIDATION_FAILED, validationErr.message);
        return;
      }

      if (!safeName) {
        setErrorMsg("Please enter your full name.");
        setLoading(false);
        return;
      }

      // OWASP A07 – Enforce strong passwords
      const strength = validatePasswordStrength(password);
      if (!strength.valid) {
        setErrorMsg(strength.message);
        setLoading(false);
        return;
      }

      const matches = (password === confirm);
      if (!matches) {
        setErrorMsg("Passwords do not match.");
        setLoading(false);
        return;
      }

      // OWASP A02 – secureRegister uses Firebase Auth (hashed) not Firestore plaintext
      const result = await secureRegister(safeName, safeEmail, password, safePhone, role);

      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      navigate("/login");
    } catch (err) {
      securityLog.error(SecurityEvents.AUTH.REGISTER_FAILED, "Unexpected registration error", {
        message: err.message,
      });
      setErrorMsg("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = (msg) => {
    if (!msg) return "";
    if (pwStrength.valid) return "#22c55e"; // green
    return "#f59e0b"; // amber
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <h1>Nau Mai, Haere Mai!</h1>
        <p className="auth-subtitle">You're one step away from joining GearUP.</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <h2 className="register-header">Create Account</h2>

        {errorMsg && (
          <div className="error-box" role="alert" aria-live="assertive">
            {errorMsg}
          </div>
        )}

        {/* OWASP A03 – labelled, typed inputs */}
        <input
          id="reg-name"
          className="input-field"
          placeholder="Full Name"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-label="Full name"
        />
        <input
          id="reg-email"
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          maxLength={254}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-label="Email address"
        />
        <input
          id="reg-phone"
          type="tel"
          className="input-field"
          placeholder="Phone"
          value={phone}
          maxLength={20}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          aria-label="Phone number"
        />

        <select
          id="reg-role"
          className="input-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Account type"
        >
          <option value="User">User</option>
          <option value="CarOwner">Car Owner</option>
        </select>

        {/* OWASP A07 – Password with strength indicator */}
        <input
          id="reg-password"
          type="password"
          className="input-field"
          placeholder="Password (min 8 chars, upper, lower, digit, special)"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="new-password"
          aria-label="Password"
        />
        {pwStrength.message && (
          <p style={{ fontSize: "0.78rem", color: strengthColor(pwStrength.message), marginTop: "-8px" }}>
            {pwStrength.valid ? "✔ Strong password" : `⚠ ${pwStrength.message}`}
          </p>
        )}

        <input
          id="reg-confirm"
          type="password"
          className="input-field"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          aria-label="Confirm password"
        />

        <button
          id="reg-submit-btn"
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
