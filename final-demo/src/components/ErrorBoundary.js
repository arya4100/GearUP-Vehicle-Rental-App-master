// src/components/ErrorBoundary.js
// OWASP A08 – Software and Data Integrity Failures
//
// Catches runtime errors and prevents the app from exposing raw stack traces
// or internal state to the user (which could leak implementation details
// useful to an attacker — a form of information disclosure).

import React from "react";
import { securityLog } from "../security/securityLogger";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // OWASP A09 – Log the error internally without exposing it to the user
    securityLog.error("RUNTIME_ERROR", "Unhandled React error caught by ErrorBoundary", {
      message: error.message,
      // Omit full stack to avoid leaking internals in storage
      componentStack: info.componentStack?.slice(0, 200),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#94a3b8", maxWidth: "400px", marginBottom: "2rem" }}>
            An unexpected error occurred. Our team has been notified.
            Please refresh the page or return to the homepage.
          </p>
          <button
            id="error-boundary-reload-btn"
            onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Return to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
