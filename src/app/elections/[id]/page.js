'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ELECTIONS } from '@/data/elections';
import { ROUTES, ELECTION_STATUS, ELECTION_TYPES } from '@/constants';
import { isLoggedIn, getVoterData } from '@/utils/voterUtils';
import { Calendar, MapPin, Users, Clock, Navigation, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';

// Dynamic import for Maps (client-only)
const GoogleMapComponent = dynamic(() => import('@/components/GoogleMap'), { ssr: false, loading: () => <div className="skeleton" style={{ height: 300, borderRadius: 12 }} /> });

/** Timeline Component */
function ElectionTimeline({ stages }) {
  return (
    <div className="timeline">
      {stages.map((stage, i) => (
        <div key={stage.id} className="timeline-item">
          <div className={`timeline-dot ${stage.completed ? 'completed' : stage.current ? 'current' : ''}`} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: stage.current ? 'var(--primary-light)' : stage.completed ? 'var(--text)' : 'var(--text3)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TranslatedText text={stage.title} />
              {stage.current && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>CURRENT</span>}
              {stage.completed && !stage.current && <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>✓</span>}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 4 }}><TranslatedText text={stage.date} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}><TranslatedText text={stage.description} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Booth Info Component */
function BoothInfo({ booth, election }) {
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}&travelmode=walking`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'navigate_to_booth', { booth: booth.name });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--success)' }}>🏫 Your Assigned Booth</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            ['Booth Name', booth.name],
            ['Booth Number', `#${booth.number}`],
            ['Timings', booth.timings],
            ['Wheelchair Access', booth.wheelchairAccessible ? '♿ Yes' : '❌ No'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text={k} /></div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}><TranslatedText text={v} /></div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 16 }}>
          <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />{booth.address}
        </div>
        {election.status === ELECTION_STATUS.ONGOING && (
          <button className="btn btn-primary" onClick={handleNavigate} id="navigate-to-booth-btn" style={{ width: '100%' }}>
            <Navigation size={16} /> Navigate to Booth (Google Maps)
          </button>
        )}
      </div>

      {/* Map */}
      <div className="map-container" style={{ height: 300 }}>
        <GoogleMapComponent lat={booth.lat} lng={booth.lng} boothName={booth.name} />
      </div>

      {/* Booth Guidelines */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 14 }}>📋 Booth Guidelines</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            '✅ Carry your Voter ID card (or Aadhaar card)',
            '✅ Arrive early — polling is from 7AM to 6PM',
            '🚫 Mobile phones are not allowed inside the voting booth',
            '🚫 No campaign material within 100m of the booth',
            '🚫 Do not photograph your vote',
            '✅ Your vote is completely secret and secure',
            '✅ You can ask for help from Polling Officer if needed',
            '✅ Ink mark on your finger confirms your vote was cast',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text2)', display: 'flex', gap: 8 }}>
              <span style={{ flexShrink: 0 }}>{item.slice(0, 2)}</span>
              <span><TranslatedText text={item.slice(2)} /></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [tab, setTab] = useState('overview');
  const [voterData, setVoterData] = useState(() => {
    if (typeof window !== 'undefined' && isLoggedIn()) {
      return getVoterData();
    }
    return null;
  });

  const election = ELECTIONS.find(e => e.id === params.id);

  if (!election) {
    return (
      <div className="page-wrapper flex-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}><TranslatedText text="Election not found" /></h1>
          <Link href={ROUTES.ELECTIONS}><button className="btn btn-primary"><TranslatedText text="Back to Elections" /></button></Link>
        </div>
      </div>
    );
  }

  const isEligible = voterData && election.state === voterData.state;
  const isToday = election.status === ELECTION_STATUS.ONGOING;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: '📅 Timeline' },
    { key: 'candidates', label: '👥 Candidates' },
    ...((isToday && isEligible) ? [{ key: 'booth', label: '🗳️ Vote Today' }] : []),
  ];

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Back */}
        <Link href={ROUTES.ELECTIONS} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text3)', marginBottom: 24, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Elections
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="flex gap-12" style={{ alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: '2rem' }}>{election.icon}</span>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800 }}><TranslatedText text={election.name} /></h1>
            <span className={`badge ${election.status === ELECTION_STATUS.ONGOING ? 'badge-success' : election.status === ELECTION_STATUS.UPCOMING ? 'badge-warning' : 'badge-gray'}`}>
              {election.status === ELECTION_STATUS.ONGOING ? `🔴 ${t('karnataka_voting', language)}` : 
               election.status === ELECTION_STATUS.UPCOMING ? `🟡 ${t('upcoming', language)}` : 
               `⚫ ${t('past', language)}`}
            </span>
            {voterData && (
              <span className={`badge ${isEligible ? 'badge-success' : 'badge-gray'}`}>
                {isEligible ? t('you_can_vote', language) : t('not_in_your_state', language)}
              </span>
            )}
          </div>
          <div className="flex gap-24" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.85rem' }}>
              <Calendar size={14} /> {new Date(election.votingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.85rem' }}>
              <MapPin size={14} /> <TranslatedText text={election.state} />
            </div>
            <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.85rem' }}>
              <Users size={14} /> <TranslatedText text={election.type} />
            </div>
          </div>
        </div>

        {/* Learn Prompt Banner */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(99,102,241,0.05))', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '1.5rem' }}>📚</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}><TranslatedText text="New to elections? Learn before you vote!" /></div>
            <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
              <TranslatedText text="Understand the process, your rights, and what an MLA/MP does — before casting your vote." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={ROUTES.LEARN}><button className="btn btn-outline btn-sm">📖 <TranslatedText text="learn" /></button></Link>
            <Link href="/representatives"><button className="btn btn-ghost btn-sm">🎖️ <TranslatedText text="political_positions" /></button></Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 32 }}>
          {tabs.map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {!voterData && (
                <div className="card" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: '1.2rem' }}>🔒</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}><TranslatedText text="Check your eligibility for this election" /></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}><TranslatedText text="Login to see if you are eligible to vote and find your booth details." /></div>
                    </div>
                    <Link href={ROUTES.LOGIN}><button className="btn btn-primary btn-sm"><TranslatedText text="Login" /></button></Link>
                  </div>
                </div>
              )}
              <div className="card">
                <h2 style={{ fontWeight: 700, marginBottom: 16 }}><TranslatedText text="About This Election" /></h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <p style={{ color: 'var(--text2)', lineHeight: 1.7, flex: 1 }}><TranslatedText text={election.description} /></p>
                  <Link href={`/election-types?type=${
                    election.type === ELECTION_TYPES.LOK_SABHA ? 'lok-sabha' : 
                    election.type === ELECTION_TYPES.VIDHAN_SABHA ? 'vidhan-sabha' :
                    election.type === ELECTION_TYPES.LOCAL_BODY ? 'local-body' :
                    election.type === ELECTION_TYPES.RAJYA_SABHA ? 'rajya-sabha' : 
                    election.type === ELECTION_TYPES.BY_ELECTION ? 'vidhan-sabha' : 'lok-sabha'
                  }`}>
                    <button className="btn btn-sm btn-outline" style={{ flexShrink: 0, padding: '6px 12px', fontSize: '0.8rem' }}>
                      <TranslatedText text="Read about this Election Type" /> <ChevronRight size={14} style={{ display: 'inline' }} />
                    </button>
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['What does it elect?', election.whatElected],
                    ['Who can vote?', election.whoCanVote],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: 16, background: 'var(--bg3)', borderRadius: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6 }}><TranslatedText text={k} /></div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4 }}><TranslatedText text={v} /></div>
                      </div>
                      {k === 'What does it elect?' && (
                        <div style={{ marginTop: 12 }}>
                          <Link href={`/representatives?role=${
                            election.type === ELECTION_TYPES.LOK_SABHA ? 'mp-lok-sabha' : 
                            election.type === ELECTION_TYPES.VIDHAN_SABHA ? 'mla' :
                            election.name.includes('MPTC') ? 'mptc' :
                            election.name.includes('ZPTC') ? 'zptc' : 'mla'
                          }`}>
                            <button className="btn btn-sm" style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', fontSize: '0.75rem', padding: '6px 12px' }}>
                              <TranslatedText text="Know more" /> <ChevronRight size={12} style={{ display: 'inline', marginLeft: 4 }} />
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {isToday && (
                isEligible ? (
                  <div className="card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--success)', marginBottom: 12 }}>🔴 Today is Polling Day!</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 16 }}>Polling is open from <strong>7:00 AM to 6:00 PM</strong>. Head to your assigned booth and exercise your vote!</p>
                    <button className="btn btn-success" onClick={() => setTab('booth')} id="go-to-booth-tab-btn" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none' }}>
                      <Navigation size={16} /> <TranslatedText text="Find My Booth" />
                    </button>
                  </div>
                ) : (
                  <div className="card" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text3)', marginBottom: 12 }}>🔴 Election is Ongoing</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 16 }}>This election is currently taking place in <strong>{election.state}</strong>. You are not eligible to vote in this state.</p>
                  </div>
                )
              )}
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}><TranslatedText text="Quick Stats" /></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="Election Type" /></div><div style={{ fontWeight: 600 }}><TranslatedText text={election.type} /></div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="State" /></div><div style={{ fontWeight: 600 }}><TranslatedText text={election.state} /></div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="Voting Day" /></div><div style={{ fontWeight: 600 }}>{new Date(election.votingDay).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="Polling Hours" /></div><div style={{ fontWeight: 600 }}>7:00 AM – 6:00 PM</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="Booth Timings" /></div><div style={{ fontWeight: 600 }}><TranslatedText text={election.booth.timings} /></div></div>
                {voterData && <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text="Your Eligibility" /></div><div style={{ fontWeight: 600, color: isEligible ? 'var(--success)' : 'var(--text3)' }}>{isEligible ? t('you_can_vote', language) : t('not_in_your_state', language)}</div></div>}
              </div>
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="card" style={{ maxWidth: 700 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 28 }}>📅 Election Timeline</h2>
            <ElectionTimeline stages={election.timeline} />
          </div>
        )}

        {tab === 'candidates' && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: 24 }}><TranslatedText text="Candidates" /></h2>
            <div className="grid-2">
              {election.candidates.map((candidate, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {candidate.symbol}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}><TranslatedText text={candidate.name} /></div>
                    <div style={{ color: 'var(--primary-light)', fontSize: '0.85rem' }}><TranslatedText text={candidate.party} /></div>
                    <div style={{ color: 'var(--text3)', fontSize: '0.8rem' }}><TranslatedText text={candidate.constituency} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginTop: 20, background: 'rgba(99,102,241,0.05)' }}>
              <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                ℹ️ <TranslatedText text="These are demo candidates for educational purposes. In a real election, you can check the full candidate list on the Election Commission website." />
              </p>
            </div>
          </div>
        )}

        {tab === 'booth' && isToday && (
          <BoothInfo booth={election.booth} election={election} />
        )}
      </div>
    </div>
  );
}
