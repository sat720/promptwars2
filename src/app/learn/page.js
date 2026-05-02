'use client';

import { useState } from 'react';
import { isLoggedIn } from '@/utils/voterUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { Volume2, ChevronRight, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import TranslatedText from '@/components/TranslatedText';
import toast from 'react-hot-toast';

const LEARN_SECTIONS = [
  {
    id: 'process',
    icon: '📋',
    title: 'How Elections Work — Step by Step',
    color: '#6366f1',
    steps: [
      { title: 'Election Announcement', desc: 'The Election Commission of India (ECI) announces the election schedule including dates for nominations, polling, and counting.', fact: '💡 The ECI is an autonomous constitutional authority responsible for administering election processes in India.' },
      { title: 'Model Code of Conduct (MCC)', desc: 'The MCC comes into immediate effect upon announcement. It governs the conduct of political parties and candidates during elections to ensure free and fair polls.', fact: '💡 The MCC prohibits use of government resources for campaigning and prevents communal/inflammatory speeches.' },
      { title: 'Nomination Filing', desc: 'Candidates file their nomination papers with the Returning Officer. They must pay a security deposit (₹10,000 for Lok Sabha, ₹5,000 for Vidhan Sabha).', fact: '💡 Candidates lose their deposit if they fail to secure more than ⅙ of total votes polled.' },
      { title: 'Scrutiny of Nominations', desc: 'The Returning Officer examines all nomination papers to verify their validity. Invalid nominations are rejected.', fact: '💡 Candidates can appeal against rejection of their nominations to higher authorities.' },
      { title: 'Last Date of Withdrawal', desc: 'Candidates can withdraw their nominations within 2 days after scrutiny. After this date, the final candidate list is published.', fact: '💡 This is also when the official symbol allocation to candidates happens.' },
      { title: 'Election Campaigning', desc: 'Parties and candidates campaign for votes through rallies, door-to-door campaigns, and advertisements. Campaigning must stop 48 hours before polling.', fact: '💡 The "Silent Period" (48 hours before polling) was introduced to let voters make calm, uninfluenced decisions.' },
      { title: 'Polling Day', desc: 'Registered voters cast their votes at their assigned polling booths using Electronic Voting Machines (EVMs). Polls are typically open from 7AM to 6PM.', fact: '💡 India uses the world\'s largest EVM network — over 5.5 million EVMs are deployed in elections.' },
      { title: 'Vote Counting', desc: 'After polling ends, EVMs are sealed and secured. On counting day, votes are tallied and results are declared constituency-wise.', fact: '💡 Counting is conducted in the presence of candidates\' agents to ensure transparency.' },
      { title: 'Results Declaration', desc: 'The Returning Officer declares the winning candidate. The candidate with the highest number of votes wins (First-Past-the-Post system).', fact: '💡 India uses FPTP — the candidate with the most votes wins, even without a majority.' },
      { title: 'Government Formation', desc: 'The winning party (or coalition) forms the government. The President invites the leader to form the government and take oath.', fact: '💡 The President invites the leader of the largest party/coalition to form the government.' },
    ],
  },
  {
    id: 'rights',
    icon: '⚖️',
    title: 'Your Rights as a Voter',
    color: '#22c55e',
    rights: [
      { right: 'Right to Vote', article: 'Article 326', desc: 'Every citizen of India who is 18 years or older has the right to vote in elections, regardless of religion, race, caste, sex, or place of birth.' },
      { right: 'Right to Secret Ballot', article: 'RPA 1951', desc: 'Your vote is completely secret. No one — not the Election Commission, not political parties, not polling officers — can know who you voted for.' },
      { right: 'Right to NOTA', article: 'SC Order 2013', desc: 'You have the right to reject all candidates by pressing NOTA (None of the Above) on the EVM. Your vote is counted but does not affect the result.' },
      { right: 'Right to Information', article: 'SDO Guidelines', desc: 'You have the right to know about candidates\' criminal records, assets, and liabilities. Candidates must declare these in affidavits filed with the Returning Officer.' },
      { right: 'Right to Complain', article: 'ECI Guidelines', desc: 'You can report electoral malpractice, voter intimidation, or MCC violations to the Election Commission through the cVIGIL app or helpline 1950.' },
      { right: 'Right to Vote Despite Disability', article: 'ECI Directive', desc: 'Voters with disabilities have the right to accessible booths, ramps, wheelchairs, and companion assistance. Blind voters can bring a companion.' },
    ],
  },
  {
    id: 'evm',
    icon: '📱',
    title: 'EVM & VVPAT — How Voting Works',
    color: '#ec4899',
    content: `**Step 1: Verification**
The Polling Officer verifies your identity using your Voter ID or other approved documents. Your name is checked against the voter roll.

**Step 2: Ink Marking**
Indelible ink (permanent marker) is applied to your left index finger to prevent duplicate voting. This ink cannot be washed off for several days.

**Step 3: Ballot Unit**
You enter the voting compartment. The Ballot Unit shows a list of candidate names with their party symbols and a blue button next to each.

**Step 4: Casting Your Vote**
Press the blue button next to your chosen candidate. A long beep sound confirms your vote has been recorded. The EVM locks after one vote.

**Step 5: VVPAT Verification**
Immediately after pressing, the VVPAT (Voter Verified Paper Audit Trail) machine prints a slip showing the candidate name and symbol you voted for. This slip is visible through a transparent window for 7 seconds, then falls into a sealed box.

**What is EVM?**
Electronic Voting Machines are tamper-proof devices used since 2004 in all Indian elections. They consist of a Control Unit (with the Polling Officer) and a Ballot Unit (where voters vote).

**What is VVPAT?**
VVPAT provides a paper trail to verify that the EVM recorded the vote correctly. Random VVPAT counts can be done to verify EVM accuracy.

**Your vote is 100% SECRET and SECURE!**`,
  },
  {
    id: 'commission',
    icon: '🏛️',
    title: 'Election Commission of India',
    color: '#8b5cf6',
    content: `The Election Commission of India (ECI) is an autonomous constitutional authority established under **Article 324** of the Constitution of India.

**Structure:**
• Chief Election Commissioner (CEC) — Head of the Commission
• 2 Election Commissioners
• All have the same powers and tenure as Supreme Court Judges

**Key Powers:**
• Announce and schedule elections
• Enforce the Model Code of Conduct
• Recognize and de-recognize political parties
• Allot election symbols to parties and candidates
• Conduct re-elections if malpractice is found
• Penalize parties/candidates violating election rules

**Important Constitutional Articles:**
• Article 324 — Superintendence, direction, and control of elections
• Article 325 — No person to be ineligible on grounds of religion, race, caste or sex
• Article 326 — Elections to be on the basis of adult suffrage
• Article 327 — Power of Parliament to make provision for elections
• Article 329 — Bar to interference by courts in electoral matters

**How to Contact ECI:**
• Website: eci.gov.in
• National Voter Helpline: 1950
• Grievance: cVIGIL App`,
  },
  {
    id: 'dosdonts',
    icon: '✅',
    title: "Dos and Don'ts on Election Day",
    color: '#14b8a6',
    dos: [
      'Carry your Voter ID card or any approved document',
      'Arrive at your assigned polling booth during polling hours (7AM–6PM)',
      'Stand in the queue patiently and wait for your turn',
      'Check the voter roll to confirm your name before polling day',
      'Exercise your right to vote without fear or pressure',
      'Report any malpractice to the Presiding Officer or cVIGIL app',
      'Help elderly or disabled voters exercise their rights',
    ],
    donts: [
      'Do not carry mobile phones or cameras inside the voting compartment',
      'Do not display campaign material within 100 meters of the booth',
      'Do not accept money or gifts in exchange for your vote (it is illegal)',
      'Do not tell anyone who you voted for — your vote is secret',
      'Do not impersonate another voter',
      'Do not photograph your vote on the EVM',
      'Do not create disturbance or intimidate other voters',
    ],
  },
];

/** TTS helper */
async function speakText(text) {
  const cleanText = text.replace(/\*\*/g, '');
  try {
    const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cleanText }) });
    const data = await res.json();
    if (data.audioContent) {
      new Audio(`data:audio/mp3;base64,${data.audioContent}`).play();
      return;
    }
  } catch {}
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = 'en-IN';
    window.speechSynthesis.speak(utt);
  }
}

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState('process');
  const [activeStep, setActiveStep] = useState(0);
  const [expandedRight, setExpandedRight] = useState(null);
  const { language } = useLanguage();
  const loggedIn = isLoggedIn();

  const section = LEARN_SECTIONS.find(s => s.id === activeSection);

  return (
    <main className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        <header style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-info" style={{ marginBottom: 16 }}>📚 <TranslatedText text="Interactive Education" /></div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12 }}>
            <TranslatedText text="Learn About" /> <span className="gradient-text"><TranslatedText text="Indian Elections" /></span>
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 550, margin: '0 auto' }}>
            <TranslatedText text="Everything you need to know — from how elections work to your rights as a voter. Interactive, easy-to-follow, and in plain language." />
          </p>
        </header>

        <nav style={{ display: 'flex', gap: 10, marginBottom: 40, overflowX: 'auto', paddingBottom: 8, flexWrap: 'wrap' }} aria-label="Learning Topics">
          {LEARN_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              aria-pressed={activeSection === s.id}
              aria-label={`Learn about ${s.title}`}
              style={{
                padding: '10px 18px', borderRadius: 100, border: `2px solid ${activeSection === s.id ? s.color : 'var(--border2)'}`,
                background: activeSection === s.id ? `${s.color}20` : 'var(--bg3)',
                color: activeSection === s.id ? s.color : 'var(--text2)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
              }}>
              {s.icon} <TranslatedText text={s.title.split('—')[0].trim()} />
            </button>
          ))}
          <Link href="/representatives">
            <button style={{
              padding: '10px 18px', borderRadius: 100, border: '2px solid var(--border2)',
              background: 'var(--bg3)', color: 'var(--text2)', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              🎖️ <TranslatedText text="political_positions" />
            </button>
          </Link>
          <Link href="/election-types">
            <button style={{
              padding: '10px 18px', borderRadius: 100, border: '2px solid var(--border2)',
              background: 'var(--bg3)', color: 'var(--text2)', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Layers size={14} /> <TranslatedText text="Types of Elections in India" />
            </button>
          </Link>
        </nav>

        {/* Section content */}
        {section.id === 'process' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }} aria-label="Election Process Steps">
              {section.steps.map((step, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  aria-pressed={activeStep === i}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  style={{
                    padding: '12px 16px', borderRadius: 10, border: 'none', textAlign: 'left', cursor: 'pointer',
                    background: activeStep === i ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: activeStep === i ? 'var(--primary-light)' : 'var(--text2)',
                    fontWeight: activeStep === i ? 600 : 400, fontSize: '0.85rem',
                    borderLeft: `3px solid ${activeStep === i ? 'var(--primary)' : 'transparent'}`,
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: i < activeStep ? 'var(--success)' : i === activeStep ? 'var(--primary)' : 'var(--bg3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', flexShrink: 0, color: 'white', fontWeight: 700,
                    }}>{i < activeStep ? '✓' : i + 1}</div>
                    <TranslatedText text={step.title} />
                  </div>
                </button>
              ))}
            </nav>
            {/* Step detail */}
            <div className="card animate-fade" key={activeStep}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{activeStep + 1}</div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}><TranslatedText text={section.steps[activeStep].title} /></h2>
                </div>
                <button onClick={() => speakText(section.steps[activeStep].desc)} className="btn btn-ghost btn-sm" aria-label="Read aloud"><Volume2 size={16} /></button>
              </div>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '1rem', marginBottom: 20 }}>
                <TranslatedText text={section.steps[activeStep].desc} />
              </p>
              <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, fontSize: '0.9rem', color: 'var(--text2)' }}>
                <TranslatedText text={section.steps[activeStep].fact} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline btn-sm" disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>← <TranslatedText text="Previous" /></button>
                <button className="btn btn-primary btn-sm" disabled={activeStep === section.steps.length - 1} onClick={() => setActiveStep(s => s + 1)}><TranslatedText text="Next" /> →</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${((activeStep + 1) / section.steps.length) * 100}%` }} />
                  </div>
                  <span style={{ marginLeft: 10, fontSize: '0.8rem', color: 'var(--text3)' }}>{activeStep + 1}/{section.steps.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}



        {section.id === 'rights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {section.rights.map((r, i) => (
              <div key={i} className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}><TranslatedText text={r.right} /></h3>
                  <span className="badge badge-success">{r.article}</span>
                </div>
                <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  <TranslatedText text={r.desc} />
                </p>
                <button onClick={() => speakText(r.desc)} className="btn btn-ghost btn-sm" aria-label="Read aloud" style={{ marginTop: 8 }}><Volume2 size={14} /> <TranslatedText text="Read aloud" /></button>
              </div>
            ))}
          </div>
        )}

        {(section.id === 'evm' || section.id === 'commission') && (
          <div className="card" style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{section.icon} <TranslatedText text={section.title} /></h2>
              <button onClick={() => speakText(section.content.replace(/\*\*/g, ''))} className="btn btn-ghost btn-sm" aria-label="Read aloud"><Volume2 size={16} /> <TranslatedText text="Read aloud" /></button>
            </div>
            <div style={{ lineHeight: 1.8, color: 'var(--text2)' }}>
              {section.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.includes('**\n')) {
                  const [title, ...rest] = para.split('\n');
                  return (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <h3 style={{ color: 'var(--text)', fontWeight: 700, marginBottom: 6 }}><TranslatedText text={title.replace(/\*\*/g, '')} /></h3>
                      {rest.map((line, j) => <p key={j} style={{ marginBottom: 4 }}><TranslatedText text={line} /></p>)}
                    </div>
                  );
                }
                return <p key={i} style={{ marginBottom: 14 }}><TranslatedText text={para.replace(/\*\*/g, '')} /></p>;
              })}
            </div>
          </div>
        )}

        {section.id === 'dosdonts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
              <h2 style={{ fontWeight: 800, color: 'var(--success)', marginBottom: 20 }}>✅ <TranslatedText text="Do's" /></h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.dos.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span> <TranslatedText text={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
              <h2 style={{ fontWeight: 800, color: 'var(--danger)', marginBottom: 20 }}>🚫 <TranslatedText text="Don'ts" /></h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.donts.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✗</span> <TranslatedText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Representatives CTA */}
        <div className="card" style={{ marginTop: 48, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.06))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2rem' }}>🎖️</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 6 }}><TranslatedText text="Who represents you in government?" /></h3>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              <TranslatedText text="Learn about MLAs, MPs, Sarpanch and Councillors — what they do, how to contact them, and your rights as a constituent." />
            </p>
          </div>
          <Link href="/representatives">
            <button className="btn btn-primary" id="learn-representatives-cta">
              🎖️ <TranslatedText text="political_positions" /> <ChevronRight size={16} />
            </button>
          </Link>
        </div>

        {/* Quiz CTA */}
        <div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🧠</div>
          <h3 style={{ fontWeight: 800, marginBottom: 8 }}><TranslatedText text="Test Your Knowledge" /></h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 20 }}>
            <TranslatedText text="Take our election quiz to see how much you know! Login required to save your score." />
          </p>
          {loggedIn ? (
            <Link href={ROUTES.QUIZ}>
              <button className="btn btn-primary" id="learn-quiz-cta">
                🧠 <TranslatedText text="Start Quiz" />
              </button>
            </Link>
          ) : (
            <div>
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 12 }}>
                🔒 <TranslatedText text="Login is required to take the quiz and save your score." />
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Link href={ROUTES.LOGIN}><button className="btn btn-primary" id="learn-quiz-login-cta"><TranslatedText text="Login to Take Quiz" /></button></Link>
                <Link href={ROUTES.APPLY}><button className="btn btn-outline" id="learn-quiz-apply-cta"><TranslatedText text="Apply for Voter ID" /></button></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
