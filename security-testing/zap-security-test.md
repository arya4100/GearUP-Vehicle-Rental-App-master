# OWASP ZAP Security Testing

Security testing was performed using OWASP ZAP in Kali Linux.

Target Application:
https://gearup-1aae6.web.app

Testing Method:
Automated scan using OWASP ZAP.

Findings:
The scan identified several informational and low-risk alerts including:

- CSP Meta Policy Invalid Directive
- Timestamp Disclosure
- Suspicious Comments
- Cache Control Issues

No high-risk vulnerabilities were detected.

Conclusion:
The application shows good security posture, but improvements can be made in security header configuration.

## OWASP ZAP Automated Scan

Tool Used: OWASP ZAP (Kali Linux)

Target URL:
https://gearup-1aae6.web.app

Testing Method:
Automated Scan using traditional spider and AJAX spider.

Key Findings:
- CSP Meta Policy warnings
- Missing security headers
- Cache control recommendations

Risk Level:
Low to Medium alerts detected.

Evidence:
Screenshot available in security-testing/screenshots/zap-scan-results.png & zap-scan-results 1.png

Updated ZAP scan documentation – Tanveer security testing contribution.

## Additional Testing Notes
ZAP scan executed in Kali Linux virtual machine during security testing phase.