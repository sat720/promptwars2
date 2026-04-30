/**
 * @fileoverview Pre-written FAQ responses for Vote Assist chatbot fallback
 * Used when Gemini API is unavailable to ensure uninterrupted service
 */

/**
 * @typedef {Object} FAQItem
 * @property {string[]} keywords - Keywords to match user query against
 * @property {string} answer - Pre-written answer
 * @property {string} [link] - Optional in-app link
 * @property {string} [linkText] - Optional link text
 */

/** @type {FAQItem[]} */
export const FAQ_RESPONSES = [
  {
    keywords: ['voter id', 'voter card', 'apply', 'get voter id', 'how to get voter id', 'register', 'voter registration'],
    answer: 'To get your Voter ID on VoteWise AI:\n1. Click "Apply for Voter ID" on the home page or go to the Apply section\n2. Fill in your full name, date of birth, gender, and address details\n3. Upload your photo\n4. Submit the form — your unique Voter ID will be generated instantly!\n\nYour Voter ID is valid for this session and will be saved for 4 hours.',
    link: '/apply',
    linkText: 'Apply for Voter ID →',
  },
  {
    keywords: ['login', 'sign in', 'how to login', 'log in', 'access'],
    answer: 'To login to VoteWise AI:\n1. You need a Voter ID first (apply at /apply if you don\'t have one)\n2. Go to the Login page\n3. Enter your Voter ID\n4. Enter the demo OTP: **11111**\n5. Click Login — you\'re in!\n\nNote: OTP is fixed as 11111 for demo purposes.',
    link: '/login',
    linkText: 'Go to Login →',
  },
  {
    keywords: ['otp', 'password', 'demo otp', 'what is otp'],
    answer: 'The demo OTP for VoteWise AI is **11111**. This is a fixed OTP for demonstration purposes. In a real system, you would receive a one-time password on your registered mobile number.',
    link: '/login',
    linkText: 'Login with OTP →',
  },
  {
    keywords: ['election', 'elections', 'current election', 'ongoing election', 'upcoming election', 'what elections'],
    answer: 'VoteWise AI has 3 elections:\n🟢 **Karnataka Assembly 2026** — Voting TODAY!\n⚫ **Tamil Nadu Local Body 2026** — Completed 3 days ago\n🟡 **Maharashtra Lok Sabha By-election** — Voting in 5 days\n\nVisit the Elections page to see all details, timelines, and your eligibility.',
    link: '/elections',
    linkText: 'View All Elections →',
  },
  {
    keywords: ['timeline', 'election process', 'steps', 'how elections work', 'election stages'],
    answer: 'The Indian election process has these key stages:\n1. **Election Announcement** — EC declares schedule\n2. **Model Code of Conduct** — Rules for parties come into effect\n3. **Nomination Filing** — Candidates file papers\n4. **Scrutiny** — Papers verified\n5. **Withdrawal** — Last chance to withdraw\n6. **Campaigning** — Active campaigns (ends 48hrs before polling)\n7. **Polling Day** — Voting day!\n8. **Counting** — Votes counted\n9. **Results** — Winners declared\n10. **Government Formation** — Winning party takes oath\n\nSee our Learn section for detailed explanations.',
    link: '/learn',
    linkText: 'Explore Learn Section →',
  },
  {
    keywords: ['eligible', 'eligibility', 'can i vote', 'who can vote', 'voting age', 'age to vote'],
    answer: 'To vote in India, you must:\n✅ Be a citizen of India\n✅ Be at least 18 years old on the qualifying date\n✅ Be registered in the electoral roll of your constituency\n✅ Not be disqualified under any law\n\nYou can vote in Lok Sabha (Parliament), Vidhan Sabha (State Assembly), and Local Body elections once you meet these criteria.',
    link: '/learn',
    linkText: 'Check Eligibility →',
  },
  {
    keywords: ['booth', 'polling booth', 'where to vote', 'voting booth', 'polling station', 'navigate to booth'],
    answer: 'Your polling booth is assigned based on your registered address and constituency. In VoteWise AI:\n1. Login with your Voter ID\n2. Go to Elections → Select an election\n3. Click the Booth tab\n4. You\'ll see your assigned booth with address, timings, and a map\n5. Click "Navigate to Booth" to open Google Maps directions',
    link: '/elections',
    linkText: 'Find Your Booth →',
  },
  {
    keywords: ['constituency', 'which constituency', 'my constituency', 'area', 'ward'],
    answer: 'Your constituency is determined by your registered address pincode. When you apply for a Voter ID on VoteWise AI and enter your pincode, we automatically map it to the correct constituency. You can see your constituency in your Dashboard after logging in.',
    link: '/dashboard',
    linkText: 'View Your Constituency →',
  },
  {
    keywords: ['evm', 'electronic voting machine', 'how to vote', 'voting machine', 'vvpat'],
    answer: 'Voting with EVM (Electronic Voting Machine):\n1. The presiding officer will verify your identity\n2. Your finger will be marked with indelible ink\n3. The Ballot Unit shows candidate names and symbols with buttons\n4. Press the button next to your chosen candidate\n5. A beep confirms your vote\n6. The VVPAT machine prints a slip showing your choice (visible for 7 seconds)\n\nYour vote is completely secret and secure!',
    link: '/learn',
    linkText: 'Learn More About EVMs →',
  },
  {
    keywords: ['nota', 'none of the above', 'reject', 'no vote'],
    answer: '**NOTA (None of the Above)** is an option on the EVM that allows you to reject all candidates. Key facts:\n• Introduced in 2013 after Supreme Court order\n• Your vote is counted but does NOT affect the result\n• The candidate with highest votes still wins\n• It is a way to express dissatisfaction with all candidates\n• Your vote remains completely secret even if you choose NOTA',
    link: '/learn',
    linkText: 'Learn About Your Rights →',
  },
  {
    keywords: ['mcc', 'model code of conduct', 'election rules', 'campaign rules'],
    answer: 'The **Model Code of Conduct (MCC)** is a set of guidelines issued by the Election Commission that governs the conduct of political parties and candidates during elections. It comes into effect when the election schedule is announced and remains until results are declared. Key rules include:\n• No use of government resources for campaigning\n• No inflammatory speeches\n• No cash or gifts to voters\n• No polling within 100m of booths\n• Equal access to media for all parties',
    link: '/learn',
    linkText: 'Learn About MCC →',
  },
  {
    keywords: ['quiz', 'test', 'knowledge', 'election quiz', 'test my knowledge'],
    answer: 'Take the VoteWise AI Election Quiz to test your knowledge!\n• 10 questions covering election process, voter rights, and constitutional provisions\n• Difficulty levels: Beginner, Intermediate, Expert\n• Earn badges for high scores\n• Every wrong answer comes with a detailed explanation\n\nHead to the Quiz section to get started!',
    link: '/quiz',
    linkText: 'Take the Quiz →',
  },
  {
    keywords: ['dashboard', 'my profile', 'my details', 'my voter id', 'view card'],
    answer: 'Your Dashboard shows:\n• Your personal details (name, DOB, gender, address)\n• Your constituency\n• Your Voter ID card (with QR code)\n• Option to edit your details\n\nYou must be logged in to access your Dashboard.',
    link: '/dashboard',
    linkText: 'Go to Dashboard →',
  },
  {
    keywords: ['language', 'translate', 'hindi', 'tamil', 'telugu', 'kannada', 'multi language'],
    answer: 'VoteWise AI supports multiple Indian languages! Click the language selector in the navigation bar to switch between:\n🇮🇳 English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી)\n\nPowered by Google Translate API.',
  },
  {
    keywords: ['lok sabha', 'parliament', 'mp', 'member of parliament'],
    answer: 'The **Lok Sabha** (House of the People) is the lower house of India\'s Parliament.\n• 543 elected seats\n• Elections every 5 years\n• Elects Members of Parliament (MPs)\n• Forms the central government\n• Prime Minister is the leader of the majority party\n• Voters vote for their local MP who represents their constituency in Delhi',
    link: '/learn',
    linkText: 'Learn About Lok Sabha →',
  },
  {
    keywords: ['vidhan sabha', 'state assembly', 'mla', 'member of legislative assembly'],
    answer: 'The **Vidhan Sabha** (State Legislative Assembly) is the lower house of a state legislature.\n• Seats vary by state (e.g., 224 in Karnataka, 288 in Maharashtra)\n• Elections every 5 years\n• Elects Members of Legislative Assembly (MLAs)\n• Forms the state government\n• Chief Minister is the leader of the majority party in the state',
    link: '/learn',
    linkText: 'Learn About Vidhan Sabha →',
  },
];

/**
 * Finds the best matching FAQ response for a user query
 * @param {string} query - User's message
 * @returns {FAQItem|null} Best matching FAQ or null if no match
 */
export function findFAQResponse(query) {
  const lowerQuery = query.toLowerCase();
  let bestMatch = null;
  let maxMatches = 0;

  for (const faq of FAQ_RESPONSES) {
    const matches = faq.keywords.filter(keyword => lowerQuery.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = faq;
    }
  }

  return maxMatches > 0 ? bestMatch : null;
}

/** Default fallback message when no FAQ matches */
export const DEFAULT_FALLBACK = {
  answer: 'I\'m having a little trouble right now, but I\'m here to help! You can browse our **Learn section** for detailed election information, or try asking about: voter registration, election timeline, polling booths, EVM usage, or election types.',
  link: '/learn',
  linkText: 'Browse Learn Section →',
};
