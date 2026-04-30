'use client';

/**
 * @fileoverview VoteWise AI Landing Page
 * Premium landing page with hero, learn preview, stats, voter ID section, and footer
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isLoggedIn, hasValidVoterData } from '@/utils/voterUtils';
import { APP_META, ROUTES } from '@/constants';
import { ArrowRight, CheckCircle, Users, Vote, BookOpen, Shield, Globe, Mic } from 'lucide-react';

/** Counter animation hook */
function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, duration, start]);

  return { count, ref };
}

/** Sample Voter ID Card Component */
function SampleVoterCard() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlipped(f => !f), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ perspective: 1000, width: 320, height: 200 }}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Front */}
        <div className="voter-card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>ELECTION COMMISSION OF INDIA</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>VOTER ID CARD</div>
            </div>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🗳️</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 52, height: 60, background: 'rgba(255,255,255,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Name</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Satvik Kumar</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Voter ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#818cf8', letterSpacing: 1 }}>SAT84723AR03</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            <span>DOB: 15 Aug 2003</span>
            <span>Constituency: Bangalore South</span>
          </div>
        </div>

        {/* Back */}
        <div className="voter-card voter-card-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>CONSTITUENCY DETAILS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Assembly</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bangalore South</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Parliamentary</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bangalore South (PC)</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>State</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Karnataka</div>
            </div>
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              🇮🇳
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '6px 10px', background: 'rgba(99,102,241,0.2)', borderRadius: 6, fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
            ⚠️ Demo Card — VoteWise AI Platform
          </div>
        </div>
      </div>
    </div>
  );
}

/** Learn preview cards */
const LEARN_PREVIEWS = [
  { icon: '📋', title: 'Election Process', desc: 'Step-by-step guide from announcement to results', color: '#6366f1' },
  { icon: '🗳️', title: 'Types of Elections', desc: 'Lok Sabha, Vidhan Sabha, and Local Body elections explained', color: '#f59e0b' },
  { icon: '⚖️', title: 'Your Voter Rights', desc: 'Know your rights, NOTA, and how to exercise your vote', color: '#22c55e' },
  { icon: '📱', title: 'EVM & Voting Guide', desc: 'How electronic voting machines work and how to vote', color: '#ec4899' },
];

/** Stats */
const STATS = [
  { value: 970, suffix: 'M+', label: 'Eligible Voters in India', icon: <Users size={24} /> },
  { value: 543, suffix: '', label: 'Lok Sabha Constituencies', icon: <Vote size={24} /> },
  { value: 4000, suffix: '+', label: 'Local Body Elections', icon: <Shield size={24} /> },
  { value: 10, suffix: '+', label: 'Languages Supported', icon: <Globe size={24} /> },
];

export default function HomePage() {
  const router = useRouter();
  const [hasVoterId, setHasVoterId] = useState(false);

  useEffect(() => {
    setHasVoterId(hasValidVoterData());
  }, []);

  const stat0 = useCountUp(970, 2000);
  const stat1 = useCountUp(543, 1800);
  const stat2 = useCountUp(4000, 2200);
  const stat3 = useCountUp(10, 1500);
  const statRefs = [stat0, stat1, stat2, stat3];

  return (
    <div className="page-wrapper">
      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.1) 0%, transparent 50%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '120px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Left: Text */}
            <div className="animate-fade">
              <div className="badge badge-info" style={{ marginBottom: 20 }}>
                🗳️ PromptWars 2026 — Election Education Platform
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                Your Vote.<br />
                Your Voice.<br />
                <span className="gradient-text">Your Power.</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text2)', marginBottom: 36, maxWidth: 480, lineHeight: 1.7 }}>
                An interactive AI-powered platform to understand India&apos;s election process, apply for your Voter ID, and participate in democracy with confidence.
              </p>
              <div className="flex gap-16" style={{ flexWrap: 'wrap' }}>
                <Link href={ROUTES.LEARN}>
                  <button className="btn btn-primary btn-lg" id="hero-learn-btn">
                    <BookOpen size={20} /> Start Learning <ArrowRight size={18} />
                  </button>
                </Link>
                {hasVoterId ? (
                  <Link href={ROUTES.LOGIN}>
                    <button className="btn btn-outline btn-lg" id="hero-login-btn">🪪 View My Voter ID</button>
                  </Link>
                ) : (
                  <Link href={ROUTES.APPLY}>
                    <button className="btn btn-accent btn-lg" id="hero-apply-btn">
                      🪪 Get Voter ID <ArrowRight size={18} />
                    </button>
                  </Link>
                )}
              </div>

              {/* Trust indicators */}
              <div className="flex gap-24" style={{ marginTop: 40, flexWrap: 'wrap' }}>
                {['Powered by Gemini AI', 'Google Cloud Secured', 'WCAG Accessible'].map(item => (
                  <div key={item} className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.8rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--success)' }} /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating voter card */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="animate-float" style={{ position: 'relative' }}>
                <SampleVoterCard />
                {/* Glow effect */}
                <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', zIndex: -1, borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'float 2s ease-in-out infinite' }}>
          <div style={{ width: 24, height: 40, border: '2px solid var(--border)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: 'var(--primary)', borderRadius: 2, animation: 'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="section-sm" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)' }}>
        <div className="container">
          <div className="grid-4">
            {STATS.map((stat, i) => (
              <div key={i} ref={statRefs[i].ref} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ color: 'var(--primary)', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>
                  {statRefs[i].count}{stat.suffix}
                </div>
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEARN PREVIEW ─── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge badge-info" style={{ marginBottom: 16 }}>📚 Interactive Education</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Understand the <span className="gradient-text">Election Process</span>
            </h2>
            <p style={{ color: 'var(--text2)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Everything you need to know about Indian elections, from announcement to government formation — explained simply and interactively.
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: 36 }}>
            {LEARN_PREVIEWS.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                onClick={() => router.push(ROUTES.LEARN)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>{item.desc}</p>
                <div style={{ height: 3, background: item.color, borderRadius: 2, marginTop: 16, width: 40, margin: '16px auto 0' }} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href={ROUTES.LEARN}>
              <button className="btn btn-primary btn-lg" id="learn-explore-btn">
                Explore All Lessons <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── GET VOTER ID ─── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Left: Text */}
            <div>
              <div className="badge badge-warning" style={{ marginBottom: 16 }}>🪪 Free & Instant</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
                Get Your <span className="gradient-text">Voter ID Card</span>
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24 }}>
                Register on VoteWise AI to get your personalized Voter ID card instantly. Enter your details, and we&apos;ll generate your unique Voter ID with constituency mapping.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  'Unique Voter ID generated instantly',
                  'Auto-mapped to your constituency via pincode',
                  'Beautiful digital card with QR code',
                  'Access all election features after login',
                ].map((item, i) => (
                  <li key={i} className="flex gap-12" style={{ alignItems: 'center', color: 'var(--text2)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
              {hasVoterId ? (
                <Link href={ROUTES.LOGIN}>
                  <button className="btn btn-accent btn-lg" id="home-view-card-btn">🪪 View My Card</button>
                </Link>
              ) : (
                <Link href={ROUTES.APPLY}>
                  <button className="btn btn-accent btn-lg" id="home-apply-now-btn">
                    Apply Now — It&apos;s Free! <ArrowRight size={18} />
                  </button>
                </Link>
              )}
            </div>

            {/* Right: Sample card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <SampleVoterCard />
                <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)', zIndex: -1, borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELECTIONS TEASER ─── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Active <span className="gradient-text">Elections</span>
            </h2>
            <p style={{ color: 'var(--text2)', marginTop: 12 }}>3 elections — ongoing, past, and upcoming</p>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            {[
              { label: '🟢 Karnataka Assembly 2026', status: 'Voting TODAY', color: '#22c55e' },
              { label: '⚫ Tamil Nadu Local Body', status: 'Completed 3 days ago', color: '#6b7280' },
              { label: '🟡 Maharashtra Lok Sabha By-poll', status: 'Voting in 5 days', color: '#f59e0b' },
            ].map((e, i) => (
              <Link key={i} href={ROUTES.ELECTIONS}>
                <div className="card" style={{ minWidth: 260, borderLeft: `4px solid ${e.color}`, cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{e.label}</div>
                  <div style={{ fontSize: '0.85rem', color: e.color }}>{e.status}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href={ROUTES.ELECTIONS}>
              <button className="btn btn-outline btn-lg" id="home-elections-btn">View All Elections <ArrowRight size={18} /></button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border2)',
        padding: '48px 24px 32px',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div className="flex gap-8" style={{ alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '1.4rem' }}>🗳️</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
                  Vote<span className="gradient-text">Wise</span> AI
                </span>
              </div>
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 320 }}>
                An interactive platform to understand India&apos;s election process. Built to support the Election Commission&apos;s vision of voter awareness and inclusive democracy.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Platform</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Learn', ROUTES.LEARN], ['Elections', ROUTES.ELECTIONS], ['Get Voter ID', ROUTES.APPLY], ['Login', ROUTES.LOGIN]].map(([label, href]) => (
                  <Link key={href} href={href} style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Powered By</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Google Gemini AI', 'Google Cloud Run', 'Google Translate', 'Google Maps', 'Google TTS', 'Google Analytics'].map(service => (
                  <div key={service} style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>🔵 {service}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>
              Made with ❤️ for <strong>PromptWars 2026</strong> · Powered by Google Gemini &amp; Google Cloud Services
            </div>
            <div style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>
              🏛️ Supporting Election Commission&apos;s voter awareness vision
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
