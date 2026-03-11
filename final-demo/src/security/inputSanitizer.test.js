import { sanitizeHTML, isValidEmail, isValidPhone, isStrongPassword } from './inputSanitizer';

describe('Security Input Sanitizer Tests', () => {

    test('sanitizeHTML should remove <script> tags and keep safe text', () => {
        const maliciousInput = "Hello <script>alert('XSS!')</script> World!";
        const sanitized = sanitizeHTML(maliciousInput);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).toContain('Hello');
    });

    test('isValidEmail should detect insecure or malformed emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('test@invalid')).toBe(false);
        expect(isValidEmail('malicious<script>@evil.com')).toBe(false);
    });

    test('isStrongPassword should enforce security baseline (8+ chars)', () => {
        expect(isStrongPassword('Weak1@')).toBe(false); // too short
        expect(isStrongPassword('SecurePassword123!')).toBe(true);
    });

    test('isValidPhone should reject injection patterns in phone fields', () => {
        expect(isValidPhone('0212345678')).toBe(true);
        expect(isValidPhone("'; DROP TABLE users;--")).toBe(false);
    });
});
