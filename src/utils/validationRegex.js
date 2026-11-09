/**
 * validationRegex.js
 * Regular expressions and validation helper functions for client-side form auditing.
 * Built to satisfy Sprint 07 QA validation requirements.
 */

// Email regex matching standard format: user@domain.tld (Sprint 07 FAQ #5)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Standard name regex (letters, spaces, hyphens, and apostrophes)
export const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;

/**
 * Validates whether a given email contains an @ symbol and matches standard RFC structure.
 * Returns an object with validity status and an error message if invalid.
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required' };
  }
  if (!email.includes('@')) {
    return { isValid: false, error: 'Email must contain an "@" symbol' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., name@example.com)' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates password length and complexity.
 * Strict Sprint 07 requirement: minimum 8 characters.
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return {
      isValid: false,
      error: `Password must be at least 8 characters (currently ${password.length})`,
    };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates confirm password against primary password.
 */
export function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (confirmPassword !== password) {
    return { isValid: false, error: 'Passwords must strictly match' };
  }
  return { isValid: true, error: '' };
}

/**
 * Evaluates password strength (0 to 4 score) for visual UX meter.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-slate-300' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const strengthMap = [
    { score: 1, label: 'Weak', color: '#ef4444' }, // Red
    { score: 2, label: 'Fair', color: '#f59e0b' }, // Amber
    { score: 3, label: 'Good', color: '#3b82f6' }, // Blue
    { score: 4, label: 'Strong', color: '#10b981' }, // Emerald
  ];

  return strengthMap[Math.max(0, score - 1)] || strengthMap[0];
}

/**
 * Validates first or last name.
 */
export function validateName(name, fieldName = 'Name') {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  if (!NAME_REGEX.test(name.trim())) {
    return { isValid: false, error: `${fieldName} should only contain letters` };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates Date of Birth.
 * FinTech requirement: user must be at least 18 years of age.
 */
export function validateDateOfBirth(dob) {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const birthDate = new Date(dob);
  const now = new Date();

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid calendar date' };
  }

  if (birthDate > now) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Calculate age difference
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, error: `You must be at least 18 years old to register (current: ${age})` };
  }

  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid birth date' };
  }

  return { isValid: true, error: '' };
}
