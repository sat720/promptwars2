import fs from 'fs';
import path from 'path';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const ongoingTimelineStr = `[
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
]`;

const pastTimelineStr = `[
  { id: 'announcement', title: 'Election Announcement', description: 'Election Commission announces schedule for elections.', date: 'March 15, 2026', completed: true, current: false },
  { id: 'nominations', title: 'Nomination Filing', description: 'Candidates file nomination papers.', date: 'March 20-27, 2026', completed: true, current: false },
  { id: 'scrutiny', title: 'Scrutiny of Nominations', description: 'Nomination papers verified.', date: 'March 28, 2026', completed: true, current: false },
  { id: 'campaigning', title: 'Election Campaigning', description: 'Active campaign phase.', date: 'March 29 - April 23, 2026', completed: true, current: false },
  { id: 'polling', title: 'Polling Day', description: 'Voters cast their votes.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: false },
  { id: 'counting', title: 'Vote Counting', description: 'Votes counted and results tallied.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: false },
  { id: 'results', title: '✅ Results Declared', description: 'Official results announced. Election completed successfully.', date: pastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: true, current: true },
]`;

const upcomingTimelineStr = `[
  { id: 'announcement', title: 'Election Announcement', description: 'Election Commission announces schedule.', date: 'April 10, 2026', completed: true, current: false },
  { id: 'nominations', title: 'Nomination Filing', description: 'Candidates file nomination papers.', date: 'April 15-22, 2026', completed: true, current: false },
  { id: 'scrutiny', title: 'Scrutiny of Nominations', description: 'Nomination papers verified.', date: 'April 23, 2026', completed: true, current: false },
  { id: 'campaigning', title: '🔴 Election Campaigning (ACTIVE)', description: 'Parties actively campaigning. Ends 48 hours before polling day.', date: 'April 24 - May 2, 2026', completed: false, current: true },
  { id: 'polling', title: 'Polling Day', description: 'Scheduled polling day.', date: upcomingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), completed: false, current: false },
  { id: 'counting', title: 'Vote Counting', description: 'Votes will be counted after polling.', date: \`\${upcomingDate.getDate() + 2} May 2026\`, completed: false, current: false },
  { id: 'results', title: 'Results Declaration', description: 'Official results to be declared.', date: \`\${upcomingDate.getDate() + 2} May 2026\`, completed: false, current: false },
]`;

let electionsStr = "";

INDIAN_STATES.forEach((state, i) => {
  const safeStateName = state.toLowerCase().replace(/[^a-z]/g, '');
  
  // 1. Lok Sabha Election
  const isUpcoming = i % 2 === 0;
  electionsStr += `
  {
    id: '${safeStateName}-loksabha-2026',
    name: '${state} Lok Sabha Election 2026',
    type: ELECTION_TYPES.LOK_SABHA,
    status: ELECTION_STATUS.ONGOING,
    votingDay: today.toISOString(),
    state: '${state}',
    description: 'General Election to elect the Members of Parliament (MPs) for the Lok Sabha from ${state}.',
    whatElected: 'Member of Parliament (MP)',
    whoCanVote: 'Indian citizens aged 18+ registered in ${state} constituencies',
    eligibleAges: [18],
    constituencies: ['${state} Central', '${state} North', '${state} South'],
    candidates: [
      { name: 'Candidate A', party: 'Bharatiya Janata Party', symbol: '🪷', constituency: '${state} Central' },
      { name: 'Candidate B', party: 'Indian National Congress', symbol: '✋', constituency: '${state} Central' },
    ],
    booth: {
      name: 'Central Government School',
      address: 'Main Road, ${state} - 100001',
      number: '01',
      lat: 20.0,
      lng: 78.0,
      timings: '7:00 AM – 6:00 PM',
      wheelchairAccessible: true,
    },
    timeline: ongoingTimeline,
    color: '#f59e0b',
    icon: '🏛️',
  },`;

  // 2. Vidhan Sabha or Local Body
  const isVidhan = i % 3 !== 0;
  electionsStr += `
  {
    id: '${safeStateName}-${isVidhan ? 'assembly' : 'local'}-2026',
    name: '${state} ${isVidhan ? 'Assembly' : 'Local Body'} Election 2026',
    type: ${isVidhan ? 'ELECTION_TYPES.VIDHAN_SABHA' : 'ELECTION_TYPES.LOCAL_BODY'},
    status: ${isUpcoming ? 'ELECTION_STATUS.PAST' : 'ELECTION_STATUS.UPCOMING'},
    votingDay: ${isUpcoming ? 'pastDate.toISOString()' : 'upcomingDate.toISOString()'},
    state: '${state}',
    description: '${isVidhan ? 'State Legislative Assembly election to elect MLAs who form the state government.' : 'Urban/Rural Local Body elections to elect ward councillors or panchayat members.'}',
    whatElected: '${isVidhan ? 'Members of Legislative Assembly (MLAs)' : 'Ward Councillors / Panchayat Members'}',
    whoCanVote: 'Indian citizens aged 18+ registered in ${state}',
    eligibleAges: [18],
    constituencies: ['Ward 1', 'Ward 2', 'Assembly 1'],
    candidates: [
      { name: 'Local Leader X', party: 'Regional Party 1', symbol: '🚲', constituency: 'Ward 1' },
      { name: 'Local Leader Y', party: 'Regional Party 2', symbol: '🏠', constituency: 'Ward 1' },
    ],
    booth: {
      name: '${state} Municipal School',
      address: 'Local Street, ${state} - 200002',
      number: '42',
      lat: 21.0,
      lng: 79.0,
      timings: '7:00 AM – 5:00 PM',
      wheelchairAccessible: true,
    },
    timeline: ${isUpcoming ? 'pastTimeline' : 'upcomingTimeline'},
    color: '${isVidhan ? '#22c55e' : '#6b7280'}',
    icon: '${isVidhan ? '🗳️' : '🏘️'}',
  },`;
});

const fileContent = `/**
 * @fileoverview Mock election data for VoteWise AI
 * Auto-generated mock data for all Indian States.
 */

import { ELECTION_STATUS, ELECTION_TYPES } from '@/constants';

const today = new Date();
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 3);
const upcomingDate = new Date(today);
upcomingDate.setDate(today.getDate() + 5);

const ongoingTimeline = ${ongoingTimelineStr};
const pastTimeline = ${pastTimelineStr};
const upcomingTimeline = ${upcomingTimelineStr};

export const ELECTIONS = [
  ${electionsStr}
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
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/elections.js'), fileContent, 'utf-8');
console.log('Successfully generated elections data!');
