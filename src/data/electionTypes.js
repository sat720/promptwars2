/**
 * @fileoverview Data definitions for different types of elections in India
 */

export const ELECTION_TYPES_DATA = [
  {
    id: 'lok-sabha',
    title: 'Lok Sabha Elections',
    subtitle: 'General Elections',
    icon: '🇮🇳',
    color: '#f59e0b',
    elects: 'Member of Parliament (MP)',
    frequency: 'Every 5 Years',
    votingMethod: 'Direct Voting (EVM/VVPAT)',
    description: 'The General Elections are held to elect the Members of Parliament for the Lok Sabha (Lower House). The country is divided into 543 constituencies. The leader of the party or coalition with the most seats is appointed as the Prime Minister by the President.',
    keyPoints: [
      'Total Seats: 543 elected directly by citizens',
      'The party with a majority (272+) forms the Central Government',
      'Determines the Prime Minister of India',
      'Elections are conducted in multiple phases across the country'
    ],
    whoCanVote: 'All Indian citizens aged 18+ registered as voters anywhere in India'
  },
  {
    id: 'vidhan-sabha',
    title: 'Vidhan Sabha Elections',
    subtitle: 'State Assembly Elections',
    icon: '🏢',
    color: '#22c55e',
    elects: 'Member of Legislative Assembly (MLA)',
    frequency: 'Every 5 Years',
    votingMethod: 'Direct Voting (EVM/VVPAT)',
    description: 'State Assembly Elections are held to elect the Members of the Legislative Assembly for a specific state. The elected MLAs represent their state constituencies. The leader of the party or coalition with a majority in the Vidhan Sabha is appointed as the Chief Minister by the Governor.',
    keyPoints: [
      'Number of seats varies by state population',
      'The party with a majority forms the State Government',
      'Determines the Chief Minister of the State',
      'Handles state-level issues like police, public health, and local infrastructure'
    ],
    whoCanVote: 'Only Indian citizens aged 18+ registered as voters within that specific state'
  },
  {
    id: 'rajya-sabha',
    title: 'Rajya Sabha Elections',
    subtitle: 'Council of States',
    icon: '🏤',
    color: '#6366f1',
    elects: 'Rajya Sabha MP',
    frequency: 'Continuous (1/3rd retire every 2 years)',
    votingMethod: 'Indirect Voting (Single Transferable Vote)',
    description: 'Rajya Sabha is the Upper House of Parliament. Members are NOT directly elected by the public. Instead, they are elected by the elected members of State Legislative Assemblies (MLAs) using proportional representation.',
    keyPoints: [
      'Total Seats: 245 (233 elected, 12 nominated by the President)',
      'Term length is 6 years per member',
      'The House is never fully dissolved (permanent body)',
      'Acts as a reviewing body for legislation passed by Lok Sabha'
    ],
    whoCanVote: 'Citizens DO NOT vote directly. Elected MLAs vote on your behalf.'
  },
  {
    id: 'local-body',
    title: 'Local Body Elections',
    subtitle: 'Panchayat & Municipal',
    icon: '🏘️',
    color: '#ec4899',
    elects: 'Sarpanch, Ward Councillor, Mayor',
    frequency: 'Every 5 Years',
    votingMethod: 'Direct Voting (EVM/Ballot)',
    description: 'These grassroots elections establish local self-government in villages (Gram Panchayats) and urban areas (Municipalities/Corporations). They directly impact daily life amenities like water, local roads, sanitation, and streetlights.',
    keyPoints: [
      'Gram Panchayat: Elects Sarpanch and Ward Members (villages)',
      'Municipal Corporation: Elects Ward Councillors and Mayor (cities)',
      '33% of seats are strictly reserved for women',
      'Managed by State Election Commissions, not the central ECI'
    ],
    whoCanVote: 'Only Indian citizens aged 18+ registered as voters within that specific village or city ward'
  },
  {
    id: 'presidential',
    title: 'Presidential Election',
    subtitle: 'Head of State',
    icon: '🏛️',
    color: '#8b5cf6',
    elects: 'President of India',
    frequency: 'Every 5 Years',
    votingMethod: 'Indirect Voting (Electoral College)',
    description: 'The President is the Head of State and the First Citizen of India. The President is not elected directly by the public, but by an Electoral College consisting of elected MPs (Lok Sabha & Rajya Sabha) and elected MLAs of all states.',
    keyPoints: [
      'Value of an MLA\'s vote depends on the population of their state',
      'Nominated members of Parliament/Assemblies cannot vote',
      'Conducted via secret ballot using Single Transferable Vote',
      'The President is the Supreme Commander of the Armed Forces'
    ],
    whoCanVote: 'Citizens DO NOT vote directly. Elected MPs and MLAs vote.'
  },
  {
    id: 'mptc',
    title: 'Mandal Parishad Elections',
    subtitle: 'Block Level Local Body',
    icon: '🌾',
    color: '#10b981',
    elects: 'MPTC Member',
    frequency: 'Every 5 Years',
    votingMethod: 'Direct Voting (EVM/Ballot)',
    description: 'Mandal Parishad Territorial Constituency (MPTC) elections are held to elect members to the block-level local government in rural areas. These members coordinate development activities between villages and the district administration.',
    keyPoints: [
      'Forms the middle tier of the Panchayati Raj system',
      'MPTC members elect the Mandal President among themselves',
      'Focuses on rural development, agriculture, and block-level schools'
    ],
    whoCanVote: 'Rural citizens aged 18+ registered in the respective territorial constituency'
  },
  {
    id: 'zptc',
    title: 'Zilla Parishad Elections',
    subtitle: 'District Level Local Body',
    icon: '🏛️',
    color: '#059669',
    elects: 'ZPTC Member',
    frequency: 'Every 5 Years',
    votingMethod: 'Direct Voting (EVM/Ballot)',
    description: 'Zilla Parishad Territorial Constituency (ZPTC) elections are the highest tier of the Panchayati Raj system. Elected members govern the entire rural area of a district and allocate funds for major rural infrastructure.',
    keyPoints: [
      'Forms the top tier of the rural local government (District Council)',
      'ZPTC members elect the Zilla Parishad Chairperson',
      'Oversees major district-level rural projects like irrigation and roads'
    ],
    whoCanVote: 'Rural citizens aged 18+ registered in the district\'s territorial constituency'
  }
];
