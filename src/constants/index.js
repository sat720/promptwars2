/**
 * @fileoverview Application-wide constants for VoteWise AI
 * Centralizing constants ensures maintainability and avoids magic strings/numbers
 */

/** Demo OTP — fixed for prototype purposes */
export const DEMO_OTP = '11111';

/** Session TTL in milliseconds (4 hours) */
export const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

/** Voter ID formula components */
export const VOTER_ID = {
  FIRST_NAME_CHARS: 3,
  RANDOM_DIGITS: 5,
  LAST_NAME_CHARS: 2,
  BIRTH_YEAR_CHARS: 2,
};

/** Supported languages */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
];

/** Election status types */
export const ELECTION_STATUS = {
  ONGOING: 'ongoing',
  UPCOMING: 'upcoming',
  PAST: 'past',
};

/** Election types */
export const ELECTION_TYPES = {
  LOK_SABHA: 'Lok Sabha',
  VIDHAN_SABHA: 'Vidhan Sabha',
  LOCAL_BODY: 'Local Body',
  RAJYA_SABHA: 'Rajya Sabha',
};

/** API rate limiting — max requests per minute */
export const RATE_LIMIT = {
  CHAT_PER_MINUTE: 20,
  TRANSLATE_PER_MINUTE: 30,
  TTS_PER_MINUTE: 20,
};

/** LocalStorage keys */
export const STORAGE_KEYS = {
  VOTER_DATA: 'votewise_voter_data',
  SESSION: 'votewise_session',
  LANGUAGE: 'votewise_language',
  THEME: 'votewise_theme',
  QUIZ_SCORE: 'votewise_quiz_score',
  CHAT_HISTORY: 'votewise_chat_history',
};

/** Navigation routes */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  APPLY: '/apply',
  DASHBOARD: '/dashboard',
  LEARN: '/learn',
  ELECTIONS: '/elections',
  ELECTION_DETAIL: '/elections/[id]',
  GUIDE: '/guide',
  QUIZ: '/quiz',
};

/** App metadata */
export const APP_META = {
  NAME: 'VoteWise AI',
  TAGLINE: 'Your Vote. Your Voice. Your Power.',
  DESCRIPTION: 'An interactive platform to understand the election process, apply for Voter ID, and participate in Indian democracy.',
  MADE_FOR: 'PromptWars 2026',
  POWERED_BY: 'Google Gemini & Google Cloud Services',
};

/** Indian states list */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];
