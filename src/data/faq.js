/**
 * @fileoverview Pre-written FAQ responses for Vote Assist chatbot fallback
 * Used when Gemini API is unavailable to ensure uninterrupted service
 * Covers: elections, voter ID, political positions (PM/CM/President/MP/MLA), eligibility, navigation
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
  // ─── VOTER ID & REGISTRATION ───────────────────────────────────────────────
  {
    keywords: ['voter id', 'voter card', 'apply', 'get voter id', 'how to get voter id', 'register', 'voter registration'],
    answer: 'To get your Voter ID on VoteWise AI:\n1. Go to the **Apply** page\n2. Fill in your full name, date of birth, gender, and address details\n3. Submit — your unique Voter ID is generated instantly!\n\n📋 Voter ID format: First 3 letters of name + digits + last 2 of surname + birth year (e.g., SAT84723AR03)',
    link: '/apply',
    linkText: 'Apply for Voter ID →',
  },
  {
    keywords: ['login', 'sign in', 'how to login', 'log in', 'access'],
    answer: 'To login to VoteWise AI:\n1. Apply for a Voter ID first (if you don\'t have one)\n2. Go to the Login page\n3. Enter your Voter ID\n4. Enter the demo OTP: **11111**\n5. Click Login — you\'re in!\n\nThe OTP is fixed as **11111** for demo purposes.',
    link: '/login',
    linkText: 'Go to Login →',
  },
  {
    keywords: ['otp', 'password', 'demo otp', 'what is otp'],
    answer: 'The demo OTP for VoteWise AI is **11111**. This is fixed for demonstration. In a real system, you\'d receive a one-time password on your registered mobile number.',
    link: '/login',
    linkText: 'Login with OTP →',
  },

  // ─── ELECTIONS ─────────────────────────────────────────────────────────────
  {
    keywords: ['election', 'elections', 'current election', 'ongoing election', 'upcoming election', 'what elections', 'which elections'],
    answer: 'VoteWise AI currently tracks over 60 elections across India!\n\n🟢 **Lok Sabha 2026** — Voting TODAY in all 33 States and UTs!\n🟡/⚫ **State Assembly & Local Body Elections** — Various upcoming and past elections across all states.\n\nVisit the Elections page to see the full list and find the ones you are eligible for.',
    link: '/elections',
    linkText: 'View All Elections →',
  },
  {
    keywords: ['timeline', 'election process', 'steps', 'how elections work', 'election stages', 'how election works', 'process'],
    answer: 'The Indian election process has these key stages:\n1. **Election Announcement** — EC declares schedule\n2. **Model Code of Conduct** — Rules come into effect\n3. **Nomination Filing** — Candidates file papers\n4. **Scrutiny** — Papers verified\n5. **Withdrawal** — Last chance to pull out\n6. **Campaigning** — Ends 48hrs before polling\n7. **Polling Day** — You vote! 🗳️\n8. **Counting** — Votes tallied\n9. **Results** — Winners declared\n10. **Government Formation** — Winning party takes oath',
    link: '/learn',
    linkText: 'Explore Learn Section →',
  },

  // ─── ELIGIBILITY ───────────────────────────────────────────────────────────
  {
    keywords: ['eligible', 'eligibility', 'can i vote', 'who can vote', 'voting age', 'age to vote', 'am i eligible'],
    answer: 'To vote in India, you must:\n✅ Be an Indian citizen\n✅ Be at least **18 years old**\n✅ Be registered in the electoral roll of your constituency\n✅ Not be disqualified under any law\n\n📋 **Which elections you can vote in:**\n• **Lok Sabha** — All citizens 18+ (national, everyone votes)\n• **Vidhan Sabha** — Only if registered in that state\n• **Local Body / Panchayat** — Only in your specific village/ward\n• **Rajya Sabha** — Your elected MLAs vote on your behalf (you don\'t vote directly)',
    link: '/learn',
    linkText: 'Check Eligibility →',
  },
  {
    keywords: ['which election eligible', 'what election can i vote', 'my elections', 'elections i can vote', 'eligible for elections'],
    answer: '🗳️ **Elections you can vote in (if 18+):**\n\n✅ **Lok Sabha (Parliament)** — Everyone in India (national election)\n✅ **Vidhan Sabha** — Only voters registered in that specific state\n✅ **Local Body / Gram Panchayat** — Only in your village/ward\n❌ **Rajya Sabha** — NOT directly by citizens; your MLAs vote for you\n❌ **President / PM / CM** — NOT directly elected by citizens\n\nTell me your state and I\'ll tell you exactly which elections apply to you! 😊',
    link: '/elections',
    linkText: 'View My Elections →',
  },

  // ─── POLITICAL POSITIONS — NAVIGATION ─────────────────────────────────────
  {
    keywords: ['political positions', 'representatives', 'go to representatives', 'take me to', 'navigate', 'political position', 'show me representatives', 'who are representatives'],
    answer: '🏛️ You can explore all **Political Positions in India** — from the President and Prime Minister to your local Sarpanch — on the Political Positions page!\n\nIt covers:\n• 🇮🇳 Prime Minister\n• 🏛️ President of India\n• 🚩 Chief Minister\n• 🏛️ MP (Lok Sabha & Rajya Sabha)\n• 🏢 MLA (Vidhan Sabha)\n• 🌾 Sarpanch\n• 🏘️ Municipal Councillor',
    link: '/representatives',
    linkText: 'Go to Political Positions →',
  },

  // ─── PRESIDENT ─────────────────────────────────────────────────────────────
  {
    keywords: ['president', 'rashtrapati', 'who is president', 'how is president elected', 'president of india'],
    answer: '🏛️ **President of India** — Head of State & First Citizen\n\n• **How selected:** Indirectly elected by an Electoral College (elected MPs + MLAs of all states)\n• **NOT directly elected by citizens**\n• **Minimum age:** 35 years\n• **Term:** 5 years\n• **Residence:** Rashtrapati Bhavan, New Delhi\n• **Key powers:** Appoints PM & Judges, is Supreme Commander of Armed Forces, can pardon death sentences\n\nTo become President, you must be an Indian citizen aged 35+ and be qualified for Lok Sabha membership.',
    link: '/representatives',
    linkText: 'Learn About President →',
  },

  // ─── PRIME MINISTER ────────────────────────────────────────────────────────
  {
    keywords: ['prime minister', 'pm', 'how pm is selected', 'who becomes pm', 'who can become pm', 'how to become pm', 'pradhan mantri'],
    answer: '🇮🇳 **Prime Minister** — Head of Government of India\n\n• **How selected:** NOT directly elected by citizens. The President appoints the leader of the majority party in Lok Sabha as PM.\n• **Who can be PM:** Any Indian citizen aged 25+ who is an MP (Lok Sabha or Rajya Sabha)\n• **Term:** 5 years (or as long as Lok Sabha confidence)\n• **Residence:** 7, Lok Kalyan Marg, New Delhi\n• **Key powers:** Leads the Cabinet, selects ministers, represents India internationally\n\nSo **YOU elect your local MP, and the MPs choose the PM!** 🗳️',
    link: '/representatives',
    linkText: 'Learn About PM →',
  },

  // ─── CHIEF MINISTER ────────────────────────────────────────────────────────
  {
    keywords: ['chief minister', 'cm', 'how cm is selected', 'who becomes cm', 'who can become cm', 'how to become cm', 'mukhyamantri'],
    answer: '🚩 **Chief Minister (CM)** — Head of State Government\n\n• **How selected:** NOT directly elected by citizens. The Governor appoints the leader of the majority party in Vidhan Sabha as CM.\n• **Who can be CM:** Any Indian citizen aged 25+ who is an MLA or MLC in that state\n• **Term:** 5 years (or as long as state assembly confidence)\n• **One CM per state and UT with assembly**\n• **Key powers:** Leads state cabinet, selects state ministers, directs state development\n\nSo **YOU elect your local MLA, and the MLAs choose the CM!** 🗳️',
    link: '/representatives',
    linkText: 'Learn About CM →',
  },

  // ─── MP ────────────────────────────────────────────────────────────────────
  {
    keywords: ['mp', 'member of parliament', 'lok sabha mp', 'who can become mp', 'how to become mp', 'parliament member'],
    answer: '🏛️ **Member of Parliament (Lok Sabha MP)**\n\n• **How elected:** Directly by citizens 18+ in the constituency (First-Past-the-Post)\n• **Who can become MP:** Indian citizen, aged 25+, registered voter in India\n• **543 seats** total in Lok Sabha\n• **Term:** 5 years\n• **Disqualified if:** Convicted criminal (2+ yr sentence), bankrupt, or government employee\n• **Role:** Represent constituency in Parliament, vote on national laws, use ₹5 crore MPLADS funds/year',
    link: '/representatives',
    linkText: 'Learn About MPs →',
  },

  // ─── MLA ───────────────────────────────────────────────────────────────────
  {
    keywords: ['mla', 'member of legislative assembly', 'vidhan sabha member', 'who can become mla', 'how to become mla', 'assembly member'],
    answer: '🏢 **Member of Legislative Assembly (MLA)**\n\n• **How elected:** Directly by citizens 18+ in the state constituency\n• **Who can become MLA:** Indian citizen, aged 25+, registered voter in that state\n• **Seats vary:** 224 (Karnataka), 294 (West Bengal), 234 (Tamil Nadu), etc.\n• **Term:** 5 years\n• **Role:** Represent constituency in Vidhan Sabha, vote on state laws, state budget\n• The Chief Minister is chosen from among the MLAs 🎯',
    link: '/representatives',
    linkText: 'Learn About MLAs →',
  },

  // ─── RAJYA SABHA ───────────────────────────────────────────────────────────
  {
    keywords: ['rajya sabha', 'upper house', 'rajya sabha mp', 'how rajya sabha elected'],
    answer: '🏤 **Rajya Sabha (Council of States)** — Upper House of Parliament\n\n• **NOT directly elected by citizens** — MLAs of each state vote to elect Rajya Sabha MPs\n• **245 seats** total\n• **Minimum age:** 30 years\n• **Term:** 6 years (⅓ retire every 2 years, never fully dissolved)\n• **Role:** Review bills from Lok Sabha, represent state interests at national level\n\nFun fact: Even if your party loses a Lok Sabha election, they may still hold Rajya Sabha seats! 💡',
    link: '/representatives',
    linkText: 'Learn About Rajya Sabha →',
  },

  // ─── SARPANCH ──────────────────────────────────────────────────────────────
  {
    keywords: ['sarpanch', 'gram panchayat', 'village head', 'panchayat', 'gram sabha'],
    answer: '🌾 **Sarpanch (Gram Panchayat Head)**\n\n• **How elected:** Directly by all voters in the village 18+\n• **Minimum age:** 21 years\n• **Term:** 5 years\n• **2.5+ lakh** Gram Panchayats across India\n• **Role:** Village development, water, roads, sanitation, implement govt schemes (MGNREGA, PM Awas Yojana)\n• 33% of Sarpanch seats reserved for women — India has 13 lakh+ elected women at Panchayat level! 🙌',
    link: '/representatives',
    linkText: 'Learn About Sarpanch →',
  },

  // ─── WHO CAN BE REPRESENTATIVE ─────────────────────────────────────────────
  {
    keywords: ['who can be representative', 'who can be elected', 'who can stand for election', 'how to become representative', 'candidate eligibility'],
    answer: '🏛️ **Who can be a political representative in India?**\n\n• **Sarpanch / Councillor:** Indian citizen, 21+ years old, registered voter in that area\n• **MLA (State Assembly):** Indian citizen, 25+ years old, registered voter in that state\n• **MP (Lok Sabha):** Indian citizen, 25+ years old, registered voter in India\n• **MP (Rajya Sabha):** Indian citizen, 30+ years old\n• **Chief Minister:** Must be an MLA/MLC, 25+ years, command majority in state assembly\n• **Prime Minister:** Must be an MP, 25+ years, command majority in Lok Sabha\n• **President:** Indian citizen, 35+ years old\n\n❌ **Disqualified if:** Convicted criminal, bankrupt, or in a paid government position',
    link: '/representatives',
    linkText: 'Explore All Positions →',
  },

  // ─── BOOTH ─────────────────────────────────────────────────────────────────
  {
    keywords: ['booth', 'polling booth', 'where to vote', 'voting booth', 'polling station', 'find booth'],
    answer: 'Your polling booth is assigned based on your registered address. In VoteWise AI:\n1. Login with your Voter ID\n2. Go to **Elections** → Select an election\n3. Click the **Booth** tab\n4. See your assigned booth with address and timings\n5. Click "Navigate to Booth" for Google Maps directions 🗺️',
    link: '/elections',
    linkText: 'Find Your Booth →',
  },

  // ─── EVM ───────────────────────────────────────────────────────────────────
  {
    keywords: ['evm', 'electronic voting machine', 'how to vote', 'voting machine', 'vvpat'],
    answer: '🖥️ **Voting with EVM:**\n1. Presiding officer verifies your identity\n2. Indelible ink marked on your finger\n3. Press the button next to your chosen candidate on the Ballot Unit\n4. A beep confirms your vote\n5. VVPAT prints a slip showing your choice (visible for 7 seconds)\n\nYour vote is completely **secret and secure!** 🔐',
    link: '/learn',
    linkText: 'Learn More About EVMs →',
  },

  // ─── NOTA ──────────────────────────────────────────────────────────────────
  {
    keywords: ['nota', 'none of the above', 'reject', 'no vote'],
    answer: '🗳️ **NOTA (None of the Above)** — Introduced in 2013\n\n• Allows you to reject ALL candidates\n• Your vote is counted but does NOT affect the result\n• The candidate with the highest votes still wins\n• A way to express dissatisfaction\n• Your vote stays completely **secret** even with NOTA',
    link: '/learn',
    linkText: 'Learn About Your Rights →',
  },

  // ─── MCC ───────────────────────────────────────────────────────────────────
  {
    keywords: ['mcc', 'model code of conduct', 'election rules', 'campaign rules'],
    answer: '📜 **Model Code of Conduct (MCC)**\n\nActivated when the election schedule is announced. Key rules:\n• No use of government resources for campaigning\n• No inflammatory speeches\n• No cash or gifts to voters\n• No polling within 100m of booths\n• Equal media access for all parties\n\nStays in effect until results are declared.',
    link: '/learn',
    linkText: 'Learn About MCC →',
  },

  // ─── QUIZ ──────────────────────────────────────────────────────────────────
  {
    keywords: ['quiz', 'test', 'knowledge', 'election quiz', 'test my knowledge'],
    answer: '🧠 **Take the VoteWise AI Election Quiz!**\n\n• 10 questions on election process, voter rights, and constitution\n• 3 difficulty levels: Beginner, Intermediate, Expert\n• Earn badges for high scores 🏆\n• Every wrong answer has a detailed explanation\n\n**Login required** to take the quiz!',
    link: '/quiz',
    linkText: 'Take the Quiz →',
  },

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  {
    keywords: ['dashboard', 'my profile', 'my details', 'my voter id', 'view card'],
    answer: '📊 **Your Dashboard shows:**\n• Your personal details (name, DOB, gender, address)\n• Your constituency\n• Your Voter ID card with QR code\n• Elections you are eligible for (My Elections)\n• Quick links to Learn, Quiz, and Political Positions\n\nYou must be **logged in** to access your Dashboard.',
    link: '/dashboard',
    linkText: 'Go to Dashboard →',
  },

  // ─── LEARN ─────────────────────────────────────────────────────────────────
  {
    keywords: ['learn', 'learn section', 'go to learn', 'election education', 'study election'],
    answer: '📚 The **Learn Section** on VoteWise AI covers:\n• How elections work (nomination, campaigning, counting)\n• Types of elections in India (Lok Sabha, Vidhan Sabha, Local Body)\n• Voter rights and responsibilities\n• EVM and VVPAT usage\n• Model Code of Conduct\n• Political Positions (PM, CM, President, MP, MLA, etc.)\n• Interactive Quiz (login required)\n\nHead there to become an election expert! 🎓',
    link: '/learn',
    linkText: 'Go to Learn →',
  },

  // ─── LANGUAGE ──────────────────────────────────────────────────────────────
  {
    keywords: ['language', 'translate', 'hindi', 'tamil', 'telugu', 'kannada', 'multi language', 'change language'],
    answer: '🌐 VoteWise AI supports multiple Indian languages!\n\nClick the 🌐 language selector in the navbar to switch between:\n🇮🇳 English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ)\n\nPowered by Google Translate API — the interface updates automatically.',
  },

  // ─── LOK SABHA ─────────────────────────────────────────────────────────────
  {
    keywords: ['lok sabha', 'parliament', 'member of parliament', 'lower house'],
    answer: '🏛️ **Lok Sabha** (House of the People) — Lower house of India\'s Parliament\n\n• **543 elected seats**\n• Elections every **5 years** (or sooner if dissolved)\n• Voters directly elect their local MP\n• The majority party leader becomes **Prime Minister**\n• Controls the central government\n\nYou can vote for your Lok Sabha MP if you are 18+ and a registered Indian citizen!',
    link: '/learn',
    linkText: 'Learn About Lok Sabha →',
  },

  // ─── VIDHAN SABHA ──────────────────────────────────────────────────────────
  {
    keywords: ['vidhan sabha', 'state assembly', 'mla', 'member of legislative assembly', 'state election'],
    answer: '🏢 **Vidhan Sabha** (State Legislative Assembly) — State government\n\n• Seats vary: 224 (Karnataka), 288 (Maharashtra), 234 (Tamil Nadu)\n• Elections every **5 years**\n• Voters directly elect their local MLA\n• The majority party leader becomes **Chief Minister**\n• Controls state-level governance and budget',
    link: '/learn',
    linkText: 'Learn About Vidhan Sabha →',
  },

  // ─── CONSTITUENCY ──────────────────────────────────────────────────────────
  {
    keywords: ['constituency', 'which constituency', 'my constituency', 'area', 'ward'],
    answer: 'Your constituency is determined by your **registered address pincode**. When you apply for a Voter ID on VoteWise AI and enter your pincode, it maps automatically to your constituency.\n\nYou can see your constituency in your **Dashboard** after logging in.',
    link: '/dashboard',
    linkText: 'View Your Constituency →',
  },
];

/**
 * Finds the best matching FAQ response for a user query
 * Uses keyword scoring — more keyword matches = better match
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
  answer: 'I\'m here to help with Indian elections and VoteWise AI! 🗳️\n\nYou can ask me about:\n• **Voter registration** — how to get your Voter ID\n• **Political positions** — PM, CM, President, MP, MLA, Sarpanch\n• **Election types** — Lok Sabha, Vidhan Sabha, Local Body\n• **Which elections you are eligible to vote in**\n• **How elections work** — timeline, EVM, NOTA\n• **Navigating VoteWise AI** — Learn, Quiz, Dashboard',
  link: '/learn',
  linkText: 'Browse Learn Section →',
};
