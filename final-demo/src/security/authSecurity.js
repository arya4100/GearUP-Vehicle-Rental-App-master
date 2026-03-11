/**
 * OWASP A02 – Cryptographic Failures
 * OWASP A07 – Identification and Authentication Failures
 *
 * Wraps Firebase Authentication (email/password) so that:
 *   1. Passwords are NEVER stored in Firestore — Firebase handles hashing.
 *   2. Sessions are managed by Firebase Auth tokens, not localStorage.
 *   3. Role is stored only in Firestore and fetched after auth — not from
 *      a client-writable localStorage field.
 *
 * Usage:
 *   import { secureLogin, secureRegister, secureLogout, getCurrentUserRole }
 *     from '../security/authSecurity';
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { securityLog, SecurityEvents } from "./securityLogger";

// ─── Login ──────────────────────────────────────────────────────────────────

/**
 * Authenticate with Firebase Auth (not Firestore password comparison).
 * Returns { success, user, role, error }.
 */
export async function secureLogin(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Fetch role from Firestore (server-authoritative)
    const snap = await getDoc(doc(db, "users", uid));
    const userData = snap.exists() ? snap.data() : {};
    const role = userData.role || "User";

    securityLog.info(SecurityEvents.AUTH.LOGIN_SUCCESS, "User logged in", {
      uid,
      role,
      email: email.replace(/(?<=.).(?=[^@]*@)/g, "*"), // partial mask
    });

    return { success: true, user: credential.user, role, userData };
  } catch (err) {
    securityLog.warn(SecurityEvents.AUTH.LOGIN_FAILED, "Login attempt failed", {
      email: email.replace(/(?<=.).(?=[^@]*@)/g, "*"),
      code: err.code,
    });
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

// ─── Register ───────────────────────────────────────────────────────────────

/**
 * Create a new user via Firebase Auth then write the profile (no password)
 * to Firestore. Returns { success, uid, error }.
 */
export async function secureRegister(name, email, password, phone, role = "User") {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Store profile WITHOUT the password field
    await setDoc(doc(db, "users", uid), {
      uid,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
      // intentionally omitting `password`
    });

    securityLog.info(SecurityEvents.AUTH.REGISTER_SUCCESS, "New user registered", {
      uid,
      role,
    });

    return { success: true, uid };
  } catch (err) {
    securityLog.warn(SecurityEvents.AUTH.REGISTER_FAILED, "Registration failed", {
      code: err.code,
    });
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

// ─── Logout ─────────────────────────────────────────────────────────────────

export async function secureLogout() {
  securityLog.info(SecurityEvents.AUTH.LOGOUT, "User logged out");
  await signOut(auth);
}

// ─── Role fetching ──────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user's role from Firestore.
 * Never trust a client-supplied role value.
 */
export async function getCurrentUserRole() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data().role : null;
}

// ─── Auth state observer ────────────────────────────────────────────────────

/** Subscribe to Firebase Auth state changes. Returns the unsubscribe fn. */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Password Reset ─────────────────────────────────────────────────────────

export async function sendResetEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    securityLog.info(SecurityEvents.AUTH.PASSWORD_RESET, "Password reset email sent");
    return { success: true };
  } catch (err) {
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

// ─── Error mapping ──────────────────────────────────────────────────────────

function mapFirebaseError(code) {
  const messages = {
    "auth/user-not-found":      "No account found with this email.",
    "auth/wrong-password":      "Incorrect password.",
    "auth/invalid-email":       "Invalid email address.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password":       "Password is too weak.",
    "auth/too-many-requests":   "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-credential":  "Invalid credentials. Please check and retry.",
  };
  return messages[code] || "Authentication error. Please try again.";
}
