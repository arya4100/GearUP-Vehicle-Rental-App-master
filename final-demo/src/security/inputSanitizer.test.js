import { sanitizeString, validateEmail, validatePasswordStrength, validatePhone } from './inputSanitizer';

describe('Security Input Sanitizer Tests', () => {

    test('sanitizeString should remove <script> tags and keep safe text', () => {
        const maliciousInput = "Hello <script>alert('XSS!')</script> World!";
        const sanitized = sanitizeString(maliciousInput);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).toContain('Hello');
    });

    test('validateEmail should detect insecure or malformed emails', () => {
        expect(() => validateEmail('test@example.com')).not.toThrow();
        expect(() => validateEmail('test@invalid')).toThrow();
        expect(() => validateEmail('malicious<script>@evil.com')).toThrow();
    });

    test('validatePasswordStrength should enforce security baseline (8+ chars)', () => {
        expect(validatePasswordStrength('Weak1@').valid).toBe(false); // too short
        expect(validatePasswordStrength('SecurePassword123!').valid).toBe(true);
    });

    test('validatePhone should reject injection patterns in phone fields', () => {
        expect(() => validatePhone('0212345678')).not.toThrow();
        expect(() => validatePhone("'; DROP TABLE users;--")).toThrow();
    });
});
