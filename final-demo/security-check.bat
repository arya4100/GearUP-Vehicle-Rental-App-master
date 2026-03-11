@echo off
:: ============================================================
:: GearUP Local OWASP Security Check Script
:: Run this from the final-demo folder:  security-check.bat
:: ============================================================
:: OWASP A06 - Checks production dependencies for known CVEs
:: OWASP A03 - ESLint security rules (no-eval, injection patterns)
:: ============================================================

echo.
echo ============================================================
echo  GearUP Security Check (OWASP Top 10)
echo ============================================================
echo.

echo [1/2] Checking for known CVEs in production dependencies (OWASP A06)...
echo --------------------------------------------------------
call npm audit --omit=dev --audit-level=critical
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Critical vulnerabilities found! Run: npm audit --omit=dev
    echo        to see details, then: npm audit fix
    exit /b 1
)
echo [PASS] No critical vulnerabilities in production dependencies.
echo.

echo [2/2] Running security ESLint rules (OWASP A03 - no eval, injection)...
echo --------------------------------------------------------
call npx eslint src --ext .js,.jsx ^
  --rule "no-eval:error" ^
  --rule "no-implied-eval:error" ^
  --rule "no-new-func:error" ^
  --max-warnings 0 ^
  --format codeframe 2>&1

if %errorlevel% neq 0 (
    echo.
    echo [FAIL] ESLint security rules failed. Fix the issues above.
    exit /b 1
)
echo [PASS] No dangerous code patterns found.
echo.

echo ============================================================
echo  All security checks PASSED!
echo ============================================================
echo.
echo  All OWASP Top 10 controls active in the app:
echo   A01 - Broken Access Control    : ProtectedRoute + Firestore Rules
echo   A02 - Cryptographic Failures   : Firebase Auth (no plaintext passwords)
echo   A03 - Injection / XSS          : inputSanitizer.js + ESLint rules
echo   A04 - Insecure Design          : urlValidator.js + Firestore rules
echo   A05 - Security Misconfiguration: CSP + security headers in firebase.json
echo   A06 - Vulnerable Components    : npm audit (just ran above)
echo   A07 - Auth Failures            : rateLimiter.js (5 attempts, 15min lockout)
echo   A08 - Software Integrity       : ErrorBoundary.js
echo   A09 - Security Logging         : securityLogger.js (structured events)
echo   A10 - SSRF                     : urlValidator.js allowlist
echo.
