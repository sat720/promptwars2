'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import TranslatedText from '@/components/TranslatedText';
import { t } from '@/data/translations';
import { ROUTES } from '@/constants';
import { REPRESENTATIVES } from '@/data/representatives';
import { ChevronRight, ArrowLeft, Mail, Phone, Globe, Users, Award, Shield, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { useEffect } from 'react';

function RepresentativeCard({ rep, onSelect }) {
  return (
    <div
      className="card hover-glow"
      onClick={() => onSelect(rep)}
      style={{ cursor: 'pointer', borderLeft: `4px solid ${rep.color}`, transition: 'transform 0.2s', background: 'var(--bg2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '2.5rem' }}>{rep.icon}</div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>
              <TranslatedText text={rep.title} />
            </h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: rep.color, fontWeight: 600 }}>
                <TranslatedText text={rep.subtitle} />
              </span>
              <span className="badge badge-gray" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                <TranslatedText text={rep.category} />
              </span>
            </div>
          </div>
        </div>
        <ChevronRight size={20} style={{ color: 'var(--text3)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: '0.8rem' }}>
        <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 2 }}>Term</div>
          <div style={{ fontWeight: 600 }}><TranslatedText text={rep.term} /></div>
        </div>
        <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 2 }}>Min. Age</div>
          <div style={{ fontWeight: 600, color: rep.color }}>{rep.eligibility.minAge}+</div>
        </div>
        <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 2 }}>Direct Vote</div>
          <div style={{ fontWeight: 600 }}>{rep.electedVia.toLowerCase().includes('direct') ? '✅ Yes' : '❌ No'}</div>
        </div>
      </div>

      <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginTop: 12, lineHeight: 1.6 }}>
        <TranslatedText text={rep.role.slice(0, 100) + '...'} />
      </p>
    </div>
  );
}

function RepresentativeDetail({ rep, onBack }) {
  const { language } = useLanguage();

  const InfoBlock = ({ title, icon, children, color }) => (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: color || 'inherit' }}>
        <span>{icon}</span> <TranslatedText text={title} />
      </h3>
      <div style={{ paddingLeft: 4 }}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-fade">
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', marginBottom: 24, fontSize: '0.9rem', padding: '8px 0' }}>
        <ArrowLeft size={16} /> <TranslatedText text="Back to Political Positions" />
      </button>

      <div className="card" style={{ background: `linear-gradient(135deg, ${rep.color}20, ${rep.color}05)`, borderLeft: `8px solid ${rep.color}`, marginBottom: 32, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '5rem' }}>{rep.icon}</div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 6 }}>
              <TranslatedText text={rep.title} />
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: rep.color, fontWeight: 700, fontSize: '1.2rem' }}><TranslatedText text={rep.subtitle} /></span>
              <span className="badge badge-accent" style={{ fontSize: '0.85rem' }}><TranslatedText text={rep.category} /></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Term Duration', value: rep.term, icon: '⏳' },
            { label: 'Min. Age to Hold', value: `${rep.eligibility.minAge} years`, icon: '🎂' },
            { label: 'Directly Elected?', value: rep.electedVia.toLowerCase().includes('direct') ? 'Yes (by people)' : 'No (Indirect)', icon: '🗳️' },
            { label: 'Primary Scope', value: rep.scope, icon: '📍' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ padding: '16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {icon} <TranslatedText text={label} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}><TranslatedText text={value} /></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }}>
        
        <InfoBlock id="role" icon="📋" title="Role & Responsibilities" color={rep.color}>
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 24, fontSize: '1.1rem' }}>
            <TranslatedText text={rep.role} />
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {rep.powers.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '16px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border2)', borderLeft: `4px solid ${rep.color}` }}>
                <span style={{ color: rep.color, fontWeight: 900 }}>{i + 1}.</span>
                <span style={{ fontSize: '1rem', lineHeight: 1.5 }}><TranslatedText text={p} /></span>
              </div>
            ))}
          </div>
        </InfoBlock>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
          
          <InfoBlock id="path" icon="🚀" title="Path to Power (How to get here)" color="var(--primary-light)">
            <div style={{ padding: '20px', background: 'rgba(99,102,241,0.05)', borderRadius: 16, border: '1px solid rgba(99,102,241,0.1)', marginBottom: 16 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1.1rem' }}>The Process:</h4>
              <p style={{ lineHeight: 1.7, color: 'var(--text2)', fontSize: '1rem' }}><TranslatedText text={rep.electedVia} /></p>
            </div>
            <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border2)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1.1rem' }}>Who makes the choice?</h4>
              <p style={{ lineHeight: 1.7, color: 'var(--text2)', fontSize: '1rem' }}><TranslatedText text={rep.electedBy} /></p>
            </div>
          </InfoBlock>

          <InfoBlock id="eligibility" icon="✅" title="Eligibility Criteria" color="var(--success)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ padding: '20px', background: 'rgba(34,197,94,0.08)', borderRadius: 16, border: '1px solid rgba(34,197,94,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 4 }}>Minimum Age</div>
                <div style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--success)' }}>{rep.eligibility.minAge}+</div>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 4 }}>Nationality</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}><TranslatedText text={rep.eligibility.citizenship} /></div>
              </div>
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)' }}>
              <Shield size={18} /> <TranslatedText text="Disqualifications" />
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rep.eligibility.disqualifications.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.03)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.08)' }}>
                  <span style={{ color: 'var(--error)', fontWeight: 900 }}>✕</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.4 }}><TranslatedText text={d} /></span>
                </div>
              ))}
            </div>
          </InfoBlock>
        </div>

        <InfoBlock id="contact" icon="📞" title="Official Protocol & Contact" color={rep.color}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>Protocol:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rep.protocol.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border2)' }}>
                    <span style={{ color: rep.color }}>★</span>
                    <span style={{ fontSize: '1rem' }}><TranslatedText text={p} /></span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>Contact Channels:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rep.howToContact.map((c, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border2)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: rep.color, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {c.method.includes('Website') ? <Globe size={14} /> : c.method.includes('Email') ? <Mail size={14} /> : <Phone size={14} />}
                      <TranslatedText text={c.method} />
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                      <TranslatedText text={c.detail} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InfoBlock>
      </div>

      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <button onClick={onBack} className="btn btn-outline">
          <ArrowLeft size={16} /> <TranslatedText text="Back to All Positions" />
        </button>
      </div>
    </div>
  );
}

export default function PoliticalPositionsPage() {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      const rep = REPRESENTATIVES.find(r => r.id === roleParam);
      if (rep) {
        setSelected(rep);
      }
    }
  }, [searchParams]);

  const categories = ['all', 'High Office', 'Elected Representative', 'Local Body'];

  const filteredReps = activeCategory === 'all'
    ? REPRESENTATIVES
    : REPRESENTATIVES.filter(r => r.category === activeCategory);

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px', maxWidth: 1000 }}>

        {!selected ? (
          <div className="animate-fade">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="badge badge-accent" style={{ marginBottom: 16 }}>🏛️ <TranslatedText text="Democratic Structure" /></div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, marginBottom: 16 }}>
                <TranslatedText text="Political" /> <span className="gradient-text"><TranslatedText text="Positions" /></span> <TranslatedText text="in India" />
              </h1>
              <p style={{ color: 'var(--text2)', maxWidth: 650, margin: '0 auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
                <TranslatedText text="India's governance is divided into three levels: National, State, and Local. Explore the key roles, from the President to the village Sarpanch, and learn how they are chosen to lead." />
              </p>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href={ROUTES.LEARN}>
                <button className="btn btn-outline btn-sm"><ArrowLeft size={16} /> <TranslatedText text="Back to Learn" /></button>
              </Link>
              <Link href={ROUTES.ELECTIONS}>
                <button className="btn btn-ghost btn-sm">🗳️ <TranslatedText text="View Elections" /></button>
              </Link>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, justifyContent: 'center' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 100,
                    border: '2px solid',
                    borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border2)',
                    background: activeCategory === cat ? 'var(--primary-light)20' : 'var(--bg2)',
                    color: activeCategory === cat ? 'var(--primary-light)' : 'var(--text2)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <TranslatedText text={cat === 'all' ? 'All Roles' : cat} />
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {filteredReps.map(rep => (
                <RepresentativeCard key={rep.id} rep={rep} onSelect={setSelected} />
              ))}
            </div>

            {/* Educational Note */}
            <div className="card" style={{ marginTop: 60, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))', border: '1px solid rgba(99,102,241,0.2)', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🗳️</div>
              <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: '1.4rem' }}><TranslatedText text="Did you know?" /></h3>
              <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>
                <TranslatedText text="While you directly vote for your MP (Lok Sabha) and MLA (Vidhan Sabha), roles like the Prime Minister and President are indirectly chosen by your elected representatives. This ensures a stable parliamentary democracy." />
              </p>
            </div>
          </div>
        ) : (
          <RepresentativeDetail rep={selected} onBack={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
