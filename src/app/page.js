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
import { ArrowRight, CheckCircle, Users, Vote, BookOpen, Shield, Globe, Mic, QrCode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';
import { ELECTIONS } from '@/data/elections';

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
            <div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 }}>ELECTION COMMISSION OF INDIA</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: 2 }}>VOTER ID CARD</div>
            </div>
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
        <div className="voter-card voter-card-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}><TranslatedText text="CONSTITUENCY DETAILS" /></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}><TranslatedText text="Assembly" /></div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}><TranslatedText text="Bangalore South" /></div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}><TranslatedText text="State" /></div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}><TranslatedText text="Karnataka" /></div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}><TranslatedText text="Address" /></div>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.4 }}><TranslatedText text="MG Road, Bangalore South, Karnataka - 560001" /></div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 15, right: 15, opacity: 0.3 }}>
            <QrCode size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LEARN_PREVIEWS = [
  { icon: '📋', title: 'Election Process', desc: 'Step-by-step guide from announcement to results', color: '#6366f1' },
  { icon: '🗳️', title: 'Types of Elections', desc: 'Lok Sabha, Vidhan Sabha, and Local Body elections explained', color: '#f59e0b' },
  { icon: '⚖️', title: 'Your Voter Rights', desc: 'Know your rights, NOTA, and how to exercise your vote', color: '#22c55e' },
  { icon: '📱', title: 'EVM & Voting Guide', desc: 'How electronic voting machines work and how to vote', color: '#ec4899' },
];

export default function HomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [hasVoterId, setHasVoterId] = useState(() => {
    if (typeof window !== 'undefined') {
      return hasValidVoterData();
    }
    return false;
  });

  return (
    <div className="page-wrapper">
      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.1) 0%, transparent 50%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '120px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div className="hero-content">
              <div className="badge badge-primary animate-bounce-slow" style={{ marginBottom: 20 }}>
                ✨ <TranslatedText text="India's Smartest Election Platform" />
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                <TranslatedText text="Empowering Every" /> <br />
                <span className="gradient-text"><TranslatedText text="Indian Voter" /></span> <TranslatedText text="with AI" />
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'var(--text2)', marginBottom: 40, maxWidth: 600 }}>
                <TranslatedText text="VoteWise AI simplifies the complex world of Indian elections. Get your voter ID, find your booth, and learn about your rights — all in one place." />
              </p>
              <div className="flex gap-16" style={{ flexWrap: 'wrap' }}>
                <Link href={ROUTES.LEARN}>
                  <button className="btn btn-primary btn-lg" id="hero-learn-btn" aria-label="Start learning about elections">
                    <BookOpen size={20} /> {t('start_learning', language)} <ArrowRight size={18} />
                  </button>
                </Link>
                 {hasVoterId ? (
                  <Link href={ROUTES.LOGIN}>
                    <button className="btn btn-outline btn-lg" id="hero-login-btn" aria-label="View my voter card">{t('view_my_card', language)}</button>
                  </Link>
                ) : (
                  <Link href={ROUTES.APPLY}>
                    <button className="btn btn-accent btn-lg" id="hero-apply-btn" aria-label="Apply for digital voter ID">
                      🪪 {t('get_voter_id', language)} <ArrowRight size={18} />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="animate-float" style={{ position: 'relative' }}>
                <SampleVoterCard />
                <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', zIndex: -1, borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: '100px 0', borderTop: '1px solid var(--border2)' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            {[
              { label: 'Eligible Voters in India', end: 970, suffix: 'M+', icon: <Users size={24} /> },
              { label: 'Lok Sabha Constituencies', end: 543, suffix: '', icon: <CheckCircle size={24} /> },
              { label: 'Local Body Elections', end: 4000, suffix: '+', icon: <Shield size={24} /> },
              { label: 'Languages Supported', end: 10, suffix: '+', icon: <Globe size={24} /> },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: 16 }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>
                  {/* Assuming StatCounter component exists or logic mapped */}
                  {stat.end}{stat.suffix}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  <TranslatedText text={stat.label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEARN PREVIEW ─── */}
      <section style={{ padding: '80px 0', background: 'var(--bg3)', borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="badge badge-info" style={{ marginBottom: 16 }}><TranslatedText text="Interactive Education" /></div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>
              <TranslatedText text="Understand the" /> <span className="gradient-text"><TranslatedText text="Election Process" /></span>
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 600, margin: '0 auto' }}>
              <TranslatedText text="Everything you need to know about Indian elections, from announcement to government formation — explained simply and interactively." />
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: 36 }}>
            {LEARN_PREVIEWS.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                onClick={() => router.push(ROUTES.LEARN)}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}><TranslatedText text={item.title} /></h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}><TranslatedText text={item.desc} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GET VOTER ID ─── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 100%)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 60 }}>
            <div style={{ order: 1 }}>
              <div className="badge badge-accent" style={{ marginBottom: 20 }}>📬 <TranslatedText text="Free & Instant" /></div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
                <TranslatedText text="Get Your" /> <span className="gradient-text"><TranslatedText text="Voter ID Card" /></span>
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '1.1rem', marginBottom: 30, lineHeight: 1.6 }}>
                <TranslatedText text="Register on VoteWise AI to get your personalized Voter ID card instantly. Enter your details, and we'll generate your unique Voter ID with constituency mapping." />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {[
                  'Unique Voter ID generated instantly',
                  'Auto-mapped to your constituency via pincode',
                  'Beautiful digital card with QR code',
                  'Access all election features after login',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '1rem', color: 'var(--text)' }}><TranslatedText text={text} /></span>
                  </div>
                ))}
              </div>
              <Link href={hasVoterId ? ROUTES.LOGIN : ROUTES.APPLY}>
                <button className="btn btn-primary btn-lg" id="section-apply-btn" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                  {hasVoterId ? `🪪 ${t('view_my_card', language)}` : `🪪 ${t('get_voter_id', language)}`}
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SampleVoterCard />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELECTIONS TEASER ─── */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
              <TranslatedText text="Active" /> <span className="gradient-text"><TranslatedText text="Elections" /></span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>
              <TranslatedText text="total_elections_count" /> <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 900 }}>66</span>
            </p>
            <p style={{ color: 'var(--text3)', fontSize: '0.95rem' }}>
              <TranslatedText text="browse_elections_desc" />
            </p>
          </div>
          <div className="grid-3">
            {[
              { title: 'Karnataka Assembly 2026', status: 'Voting TODAY', color: '#22c55e', icon: '🟢' },
              { title: 'Tamil Nadu Local Body', status: 'Completed 3 days ago', color: '#6b7280', icon: '⚫' },
              { title: 'Maharashtra Lok Sabha By-poll', status: 'Voting in 5 days', color: '#f59e0b', icon: '🟡' },
            ].map((item, i) => (
              <div key={i} className="card hover-glow" style={{ borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span>{item.icon}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light)' }}><TranslatedText text={item.title} /></h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: item.color, fontWeight: 600 }}><TranslatedText text={item.status} /></p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href={ROUTES.ELECTIONS}>
              <button className="btn btn-outline"><TranslatedText text="View All Elections" /> →</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: '60px 0 40px', background: 'var(--bg1)', borderTop: '1px solid var(--border2)' }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>
              <span style={{ fontSize: '1.4rem' }}>🗳️</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>
                Vote<span className="gradient-text">Wise</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Google Gemini AI', 'Google Cloud Run', 'Google Translate', 'Google Maps', 'Google TTS', 'Google Analytics'].map(service => (
                <span key={service} style={{ background: 'var(--bg3)', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border2)' }}>
                  <span style={{ color: '#4285F4' }}>●</span> {service}
                </span>
              ))}
              <Link href="/test">
                <span style={{ background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--primary-light)', fontWeight: 700, cursor: 'pointer' }}>
                  🧪 <TranslatedText text="Validation Suite (Tests)" />
                </span>
              </Link>
            </div>
          </div>
          <div className="divider" style={{ background: 'var(--border2)', height: 1, margin: '24px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
              <TranslatedText text="Made with ❤️ for PromptWars 2026 · Powered by Google Gemini & Google Cloud Services" />
            </div>
            <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
              🏛️ <TranslatedText text="Supporting Election Commission's voter awareness vision" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
