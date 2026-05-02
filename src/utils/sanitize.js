/**
 * @fileoverview Input sanitization utilities for VoteWise AI
 * Prevents XSS and ensures safe user inputs throughout the application
 */

/**
 * Sanitizes a plain text string by removing HTML tags and dangerous characters
 * @param {string} input - Raw user input
 * @param {number} [maxLength=200] - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeText(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'&]/g, '') // Remove dangerous chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes a name input (only letters, spaces, hyphens, apostrophes)
 * @param {string} name - Raw name input
 * @param {number} [maxLength=50] - Maximum allowed length
 * @returns {string} Sanitized name
 */
export function sanitizeName(name, maxLength = 50) {
  if (typeof name !== 'string') return '';
  return name
    .replace(/[^a-zA-Z\s\-']/g, '')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Sanitizes a pincode (only 6 digits)
 * @param {string} pincode - Raw pincode input
 * @returns {string} Sanitized 6-digit pincode
 */
export function sanitizePincode(pincode) {
  if (typeof pincode !== 'string') return '';
  return pincode.replace(/\D/g, '').slice(0, 6);
}

/**
 * Sanitizes a chat message (removes HTML, limits length)
 * @param {string} message - Raw chat message
 * @returns {string} Sanitized message
 */
export function sanitizeChatMessage(message) {
  if (typeof message !== 'string') return '';
  return message
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500); // Max 500 chars for chat
}

/**
 * Validates a Voter ID format
 * @param {string} voterId - Voter ID to validate
 * @returns {boolean} Whether the format is valid
 */
export function isValidVoterId(voterId) {
  if (typeof voterId !== 'string') return false;
  // Format: 3 letters + 5 digits + 2 letters + 2 digits = 12 chars
  const pattern = /^[A-Z]{3}[0-9]{5}[A-Z]{2}[0-9]{2}$/;
  return pattern.test(voterId.toUpperCase());
}

/**
 * Validates a date of birth — must be at least 18 years ago
 * @param {string} dob - ISO date string
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateDob(dob) {
  if (!dob) return { valid: false, message: 'Date of birth is required' };

  const birthDate = new Date(dob);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { valid: false, message: 'Invalid date format' };
  }

  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ? age - 1
    : age;

  if (actualAge < 18) {
    return { valid: false, message: `You must be at least 18 years old to register. You are currently ${actualAge} years old.` };
  }

  if (actualAge > 120) {
    return { valid: false, message: 'Please enter a valid date of birth' };
  }

  return { valid: true, message: '' };
}

/**
 * Validates required text field
 * @param {string} value - Field value
 * @param {string} fieldName - Field display name
 * @param {number} [minLength=2] - Minimum length
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRequired(value, fieldName, minLength = 2) {
  if (!value || value.trim().length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  return { valid: true, message: '' };
}

/**
 * Validates pincode format (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePincode(pincode) {
  const cleaned = sanitizePincode(pincode);
  if (cleaned.length !== 6) {
    return { valid: false, message: 'Pincode must be exactly 6 digits' };
  }
  return { valid: true, message: '' };
}

/**
 * Rate limiter using localStorage to prevent API abuse
 * @param {string} key - Rate limit key (e.g., 'chat', 'translate')
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} Whether request is allowed
 */
export function checkRateLimit(key, maxRequests, windowMs = 60000) {
  if (typeof window === 'undefined') return true;

  const storageKey = `rl_${key}`;
  const now = Date.now();

  try {
    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : { requests: [], windowStart: now };

    // Filter requests within window
    const recentRequests = data.requests.filter(t => now - t < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now);
    localStorage.setItem(storageKey, JSON.stringify({ requests: recentRequests, windowStart: now }));
    return true;
  } catch {
    return true; // Allow on error
  }
}
