/**
 * @fileoverview Voter ID generation utility for VoteWise AI
 * Formula: [First 3 letters of first name] + [5 random digits] + [Last 2 letters of last name] + [Last 2 digits of birth year]
 * Example: Satvik Kumar born 2003 → SAT84723AR03
 */

import { VOTER_ID, SESSION_TTL_MS, STORAGE_KEYS } from '@/constants';
import { getConstituencyByPincode, getDefaultConstituency } from '@/data/pincodes';

/**
 * Sanitizes a name to extract only alphabetic characters (uppercase)
 * @param {string} name - Raw name input
 * @returns {string} Sanitized uppercase alphabetic string
 */
function sanitizeName(name) {
  return name.replace(/[^a-zA-Z]/g, '').toUpperCase();
}

/**
 * Generates a random numeric string of specified length
 * @param {number} length - Desired length
 * @returns {string} Random digit string
 */
function randomDigits(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/**
 * Generates a unique Voter ID based on user details
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} dob - Date of birth (YYYY-MM-DD format)
 * @returns {string} Generated Voter ID
 */
export function generateVoterId(firstName, lastName, dob) {
  const cleanFirst = sanitizeName(firstName);
  const cleanLast = sanitizeName(lastName);
  const birthYear = new Date(dob).getFullYear().toString();

  // First 3 letters of first name (padded if shorter)
  const firstPart = cleanFirst.slice(0, VOTER_ID.FIRST_NAME_CHARS).padEnd(VOTER_ID.FIRST_NAME_CHARS, 'X');

  // 5 random unique digits
  const randomPart = randomDigits(VOTER_ID.RANDOM_DIGITS);

  // Last 2 letters of last name (padded if shorter)
  const lastPart = cleanLast.slice(-VOTER_ID.LAST_NAME_CHARS).padStart(VOTER_ID.LAST_NAME_CHARS, 'X');

  // Last 2 digits of birth year
  const yearPart = birthYear.slice(-VOTER_ID.BIRTH_YEAR_CHARS);

  return `${firstPart}${randomPart}${lastPart}${yearPart}`;
}

/**
 * @typedef {Object} VoterData
 * @property {string} voterId - Generated Voter ID
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full name
 * @property {string} dob - Date of birth
 * @property {string} gender - Gender
 * @property {string} address - Street address
 * @property {string} city - City
 * @property {string} state - State
 * @property {string} pincode - Pincode
 * @property {string} constituency - Constituency name
 * @property {string} photo - Base64 photo string or null
 * @property {number} createdAt - Timestamp when created
 * @property {number} expiresAt - Timestamp when session expires
 */

/**
 * Creates a complete voter data object
 * @param {Object} formData - Form input data
 * @returns {VoterData} Complete voter data
 */
export function createVoterData(formData) {
  const { firstName, lastName, dob, gender, address, city, state, pincode, photo } = formData;

  const voterId = generateVoterId(firstName, lastName, dob);
  const constituencyInfo = getConstituencyByPincode(pincode) || getDefaultConstituency(state);
  const now = Date.now();

  return {
    voterId,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    dob,
    gender,
    address,
    city,
    state,
    pincode,
    constituency: constituencyInfo.constituency,
    boothLat: constituencyInfo.boothLat,
    boothLng: constituencyInfo.boothLng,
    photo: photo || null,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
}

/**
 * Saves voter data to localStorage with TTL
 * @param {VoterData} voterData - Voter data to save
 */
export function saveVoterData(voterData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.VOTER_DATA, JSON.stringify(voterData));
  } catch (error) {
    console.error('Failed to save voter data:', error);
  }
}

/**
 * Retrieves voter data from localStorage, checking TTL
 * @returns {VoterData|null} Voter data if valid, null if expired or not found
 */
export function getVoterData() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTER_DATA);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Check TTL expiry
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEYS.VOTER_DATA);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve voter data:', error);
    return null;
  }
}

/**
 * Clears voter data from localStorage
 */
export function clearVoterData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.VOTER_DATA);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Saves session state (logged in)
 * @param {string} voterId - The voter ID of the logged-in user
 */
export function saveSession(voterId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ voterId, loggedInAt: Date.now() }));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Gets current session
 * @returns {Object|null} Session data or null
 */
export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clears only the session (logs out user) but keeps voter data
 */
export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Checks if voter data exists and is not expired
 * @returns {boolean}
 */
export function hasValidVoterData() {
  return getVoterData() !== null;
}

/**
 * Checks if user is currently logged in with valid session
 * @returns {boolean}
 */
export function isLoggedIn() {
  const session = getSession();
  if (!session) return false;
  const voterData = getVoterData();
  return voterData !== null && voterData.voterId === session.voterId;
}

/**
 * Formats date of birth for display
 * @param {string} dob - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDob(dob) {
  return new Date(dob).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calculates age from date of birth
 * @param {string} dob - ISO date string
 * @returns {number} Age in years
 */
export function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
