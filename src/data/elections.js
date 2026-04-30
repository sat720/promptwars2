/**
 * @fileoverview Mock election data for VoteWise AI
 * Contains 3 elections: 1 ongoing (today), 1 past (3 days ago), 1 upcoming (5 days later)
 */

import { ELECTION_STATUS, ELECTION_TYPES } from '@/constants';

const today = new Date();
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 3);
const upcomingDate = new Date(today);
upcomingDate.setDate(today.getDate() + 5);

/**
 * @typedef {Object} Candidate
 * @property {string} name - Candidate name
 * @property {string} party - Party name
 * @property {string} symbol - Party symbol emoji
 * @property {string} constituency - Constituency name
 */

/**
 * @typedef {Object} BoothInfo
 * @property {string} name - Booth name
 * @property {string} address - Booth address
 * @property {string} number - Booth number
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {string} timings - Voting timings
 * @property {boolean} wheelchairAccessible - Accessibility info
 */

/**
 * @typedef {Object} TimelineStage
 * @property {string} id - Stage ID
 * @property {string} title - Stage title
 * @property {string} description - Stage description
 * @property {string} date - Stage date string
 * @property {boolean} completed - Whether stage is completed
 * @property {boolean} current - Whether stage is current
 */

/** @type {TimelineStage[]} */
const ongoingTimeline = [
  { id: 'announcement', title: 'Election Announcement', description: 'Election Commission officially announces the election schedule and dates.', date: 'March 1, 2026', completed: true, current: false },
  { id: 'mcc', title: 'Model Code of Conduct', description: 'MCC comes into effect — political parties must follow election rules.', date: 'March 1, 2026', completed: true, current: false },
  { id: 'nominations', title: 'Nomination Filing', description: 'Candidates file nomination papers with Returning Officers.', date: 'March 10-17, 2026', completed: true, current: false },
  { id: 'scrutiny', title: 'Scrutiny of Nominations', description: 'Returning Officers verify nomination papers for validity.', date: 'March 18, 2026', completed: true, current: false },
  { id: 'withdrawal', title: 'Last Date of Withdrawal', description: 'Candidates can withdraw their nominations before this date.', date: 'March 20, 2026', completed: true, current: false },
  { id: 'campaigning', title: 'Election Campaigning', description: 'Parties and candidates campaign. Ends 48 hours before polling.', date: 'March 21 - April 27, 2026', completed: true, current: false },
  { id: 'polling', title: '🔴 Polling Day (TODAY)', description: 'Voters cast their votes at polling booths from 7AM to 6PM.', date: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: false, current: true },
  { id: 'counting', title: 'Vote Counting', description: 'Votes are counted and results are tallied constituency-wise.', date: 'May 2, 2026', completed: false, current: false },
  { id: 'results', title: 'Results & Declaration', description: 'Official results declared by Election Commission.', date: 'May 2, 2026', completed: false, current: false },
  { id: 'government', title: 'Government Formation', description: 'Winning party forms the government and takes oath.', date: 'May 15, 2026', completed: false, current: false },
];

const pastTimeline = [
  { id: 'announcement', title: 'Election Announcement', description: 'Election Commission announces schedule for Tamil Nadu Local Body elections.', date: 'March 15, 2026', completed: true, current: false },
  { id: 'nominations', title: 'Nomination Filing', description: 'Candidates file nomination papers.', date: 'March 20-27, 2026', completed: true, current: false },
  { id: 'scrutiny', title: 'Scrutiny of Nominations', description: 'Nomination papers verified.', date: 'March 28, 2026', completed: true, current: false },
  { id: 'campaigning', title: 'Election Campaigning', description: 'Active campaign phase.', date: 'March 29 - April 23, 2026', completed: true, current: false },
  { id: 'polling', title: 'Polling Day', description: 'Voters cast their votes.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: false },
  { id: 'counting', title: 'Vote Counting', description: 'Votes counted and results tallied.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: false },
  { id: 'results', title: '✅ Results Declared', description: 'Official results announced. Election completed successfully.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: true },
];

const upcomingTimeline = [
  { id: 'announcement', title: 'Election Announcement', description: 'Election Commission announces by-election schedule.', date: 'April 10, 2026', completed: true, current: false },
  { id: 'nominations', title: 'Nomination Filing', description: 'Candidates file nomination papers.', date: 'April 15-22, 2026', completed: true, current: false },
  { id: 'scrutiny', title: 'Scrutiny of Nominations', description: 'Nomination papers verified.', date: 'April 23, 2026', completed: true, current: false },
  { id: 'campaigning', title: '🔴 Election Campaigning (ACTIVE)', description: 'Parties actively campaigning. Ends 48 hours before polling day.', date: 'April 24 - May 2, 2026', completed: false, current: true },
  { id: 'polling', title: 'Polling Day', description: 'Scheduled polling day.', date: upcomingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: false, current: false },
  { id: 'counting', title: 'Vote Counting', description: 'Votes will be counted after polling.', date: `${upcomingDate.getDate() + 2} May 2026`, completed: false, current: false },
  { id: 'results', title: 'Results Declaration', description: 'Official results to be declared.', date: `${upcomingDate.getDate() + 2} May 2026`, completed: false, current: false },
];

/** @type {Object[]} */
export const ELECTIONS = [
  {
    id: 'karnataka-assembly-2026',
    name: 'Karnataka Assembly Election 2026',
    type: ELECTION_TYPES.VIDHAN_SABHA,
    status: ELECTION_STATUS.ONGOING,
    votingDay: today.toISOString(),
    state: 'Karnataka',
    description: 'The Karnataka Legislative Assembly election to elect 224 Members of the Legislative Assembly (MLAs) who form the state government.',
    whatElected: 'Members of Legislative Assembly (MLAs) — 224 seats',
    whoCanVote: 'Indian citizens aged 18+ registered in Karnataka constituencies',
    eligibleAges: [18],
    constituencies: ['Bangalore South', 'Bangalore North', 'Mysuru', 'Hubli-Dharwad', 'Mangalore'],
    candidates: [
      { name: 'Rajesh Kumar', party: 'Indian National Congress', symbol: '✋', constituency: 'Bangalore South' },
      { name: 'Priya Sharma', party: 'Bharatiya Janata Party', symbol: '🪷', constituency: 'Bangalore South' },
      { name: 'Mohan Das', party: 'Janata Dal (Secular)', symbol: '⚙️', constituency: 'Bangalore South' },
      { name: 'Anita Reddy', party: 'Aam Aadmi Party', symbol: '🧹', constituency: 'Bangalore South' },
    ],
    booth: {
      name: 'Government Higher Secondary School',
      address: 'MG Road, Bangalore South, Karnataka - 560001',
      number: '142',
      lat: 12.9716,
      lng: 77.5946,
      timings: '7:00 AM – 6:00 PM',
      wheelchairAccessible: true,
    },
    timeline: ongoingTimeline,
    color: '#22c55e',
    icon: '🗳️',
  },
  {
    id: 'tamilnadu-localbody-2026',
    name: 'Tamil Nadu Local Body Election 2026',
    type: ELECTION_TYPES.LOCAL_BODY,
    status: ELECTION_STATUS.PAST,
    votingDay: pastDate.toISOString(),
    state: 'Tamil Nadu',
    description: 'Tamil Nadu Urban Local Body elections to elect ward councillors for Municipal Corporations, Municipalities, and Town Panchayats.',
    whatElected: 'Ward Councillors for Urban Local Bodies — 4,500+ seats',
    whoCanVote: 'Indian citizens aged 18+ registered in Tamil Nadu urban local body wards',
    eligibleAges: [18],
    constituencies: ['Chennai North', 'Chennai South', 'Coimbatore', 'Madurai', 'Salem'],
    candidates: [
      { name: 'Murugan P', party: 'Dravida Munnetra Kazhagam', symbol: '🌅', constituency: 'Chennai North Ward 12' },
      { name: 'Kavitha R', party: 'All India Anna Dravida Munnetra Kazhagam', symbol: '🌊', constituency: 'Chennai North Ward 12' },
      { name: 'Selvam K', party: 'Indian National Congress', symbol: '✋', constituency: 'Chennai North Ward 12' },
    ],
    booth: {
      name: 'Corporation Primary School',
      address: 'Anna Salai, Chennai North, Tamil Nadu - 600002',
      number: '89',
      lat: 13.0827,
      lng: 80.2707,
      timings: '7:00 AM – 6:00 PM',
      wheelchairAccessible: true,
    },
    timeline: pastTimeline,
    color: '#6b7280',
    icon: '🏛️',
  },
  {
    id: 'maharashtra-loksabha-bypoll-2026',
    name: 'Maharashtra Lok Sabha By-Election 2026',
    type: ELECTION_TYPES.LOK_SABHA,
    status: ELECTION_STATUS.UPCOMING,
    votingDay: upcomingDate.toISOString(),
    state: 'Maharashtra',
    description: 'By-election for the Pune Lok Sabha constituency following a vacancy created by the resignation of the sitting Member of Parliament.',
    whatElected: 'Member of Parliament (MP) — 1 seat (Pune constituency)',
    whoCanVote: 'Indian citizens aged 18+ registered in Pune Lok Sabha constituency',
    eligibleAges: [18],
    constituencies: ['Pune'],
    candidates: [
      { name: 'Suresh Patil', party: 'Bharatiya Janata Party', symbol: '🪷', constituency: 'Pune' },
      { name: 'Meera Joshi', party: 'Shiv Sena (UBT)', symbol: '🏹', constituency: 'Pune' },
      { name: 'Ravi Kulkarni', party: 'Nationalist Congress Party', symbol: '⏰', constituency: 'Pune' },
      { name: 'Sonal Desai', party: 'Indian National Congress', symbol: '✋', constituency: 'Pune' },
    ],
    booth: {
      name: 'Pune Municipal Corporation School',
      address: 'FC Road, Pune, Maharashtra - 411004',
      number: '67',
      lat: 18.5204,
      lng: 73.8567,
      timings: '7:00 AM – 6:00 PM',
      wheelchairAccessible: false,
    },
    timeline: upcomingTimeline,
    color: '#f59e0b',
    icon: '🏛️',
  },
];

/**
 * Returns election status based on current date
 * @param {string} votingDay - ISO date string of voting day
 * @returns {string} Election status
 */
export function getElectionStatus(votingDay) {
  const now = new Date();
  const vDay = new Date(votingDay);
  const diffDays = Math.ceil((vDay - now) / (1000 * 60 * 60 * 24));
  if (diffDays < -1) return ELECTION_STATUS.PAST;
  if (diffDays >= -1 && diffDays <= 1) return ELECTION_STATUS.ONGOING;
  return ELECTION_STATUS.UPCOMING;
}
