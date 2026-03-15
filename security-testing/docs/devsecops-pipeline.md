# DevSecOps CI/CD Pipeline

The application uses a CI/CD pipeline integrated with security checks.

Pipeline stages:
1. Secret scanning (Trufflehog)
2. Dependency audit (npm audit)
3. Static analysis (Semgrep)
4. Unit testing (Jest)
5. Build process
6. Firebase deployment
7. OWASP ZAP security scan