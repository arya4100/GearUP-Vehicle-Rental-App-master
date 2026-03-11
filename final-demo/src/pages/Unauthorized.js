// OWASP A01 – Broken Access Control
// Purpose: Proper 403-equivalent page when a user lacks the required role.
// Logs the access attempt and provides clear navigation back to safety.

import React, { useEffect } from "react";
import { useNavigate }      from "react-router-dom";
import { securityLog, SecurityEvents } from "../security/securityLogger";

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    securityLog.warn(
      SecurityEvents.ACCESS.UNAUTHORIZED_ACCESS,
      "Unauthorized page rendered",
      { pathname: window.location.pathname }
    );
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      color: "#fff",
      fontFamily: "Inter, sans-serif",
      textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🚫</div>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>403 – Access Denied</h1>
      <p style={{ color: "#94a3b8", maxWidth: "400px", marginBottom: "2rem" }}>
        You don't have permission to view this page.
        If you believe this is a mistake, please contact support.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          id="unauth-back-btn"
          onClick={() => navigate(-1)}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ← Go Back
        </button>
        <button
          id="unauth-home-btn"
          onClick={() => navigate("/login")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
