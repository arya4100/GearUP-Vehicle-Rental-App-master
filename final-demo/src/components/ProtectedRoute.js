// components/ProtectedRoute.js
// OWASP A01 – Broken Access Control
// OWASP A09 – Security Logging
//
// Previously read role from localStorage (client-writable → easily forged).
// Now verifies the Firebase Auth session and reads role from Firestore
// via onAuthChange so that the role cannot be spoofed by the client.

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthChange, getCurrentUserRole } from "../security/authSecurity";
import { securityLog, SecurityEvents }      from "../security/securityLogger";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "unauth" | "forbidden"

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        // OWASP A01 – Not authenticated
        securityLog.warn(
          SecurityEvents.ACCESS.PROTECTED_ROUTE_HIT,
          "Unauthenticated access attempt redirected to login",
          { pathname: window.location.pathname }
        );
        setStatus("unauth");
        return;
      }

      if (!allowedRoles) {
        // No role restriction — just need to be logged in
        setStatus("ok");
        return;
      }

      // OWASP A01 – Fetch role from server (Firestore), never from client storage
      const role = await getCurrentUserRole();

      if (!allowedRoles.includes(role)) {
        securityLog.warn(
          SecurityEvents.ACCESS.ROLE_MISMATCH,
          "User attempted to access a route they are not authorized for",
          { role, allowedRoles, pathname: window.location.pathname }
        );
        setStatus("forbidden");
        return;
      }

      setStatus("ok");
    });

    return () => unsubscribe();
  }, [allowedRoles]);

  if (status === "loading")   return <div style={{ padding: "2rem", textAlign: "center" }}>Verifying session…</div>;
  if (status === "unauth")    return <Navigate to="/login"        replace />;
  if (status === "forbidden") return <Navigate to="/unauthorized" replace />;
  return children;
}
