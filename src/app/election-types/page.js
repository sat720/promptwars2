'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import TranslatedText from '@/components/TranslatedText';
import { t } from '@/data/translations';
import { ROUTES } from '@/constants';
import { ELECTION_TYPES_DATA } from '@/data/electionTypes';
import { ChevronRight, ArrowLeft, Users, Calendar, Fingerprint, Layers, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

function ElectionTypeCard({ type, onSelect }) {
  return (
    <div
      className="card hover-glow"
      onClick={() => onSelect(type)}
      style={{ cursor: 'pointer', borderLeft: `4px solid ${type.color}`, transition: 'transform 0.2s', background: 'var(--bg2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '2.5rem' }}>{type.icon}</div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 4 }}>
              <TranslatedText text={type.title} />
            </h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: type.color, fontWeight: 600 }}>
                <TranslatedText text={type.subtitle} />
              </span>
            </div>
          </div>
        </div>
        <ChevronRight size={20} style={{ color: 'var(--text3)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: '0.8rem' }}>
        <div style={{ padding: '10px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> Elects</div>
          <div style={{ fontWeight: 600 }}><TranslatedText text={type.elects} /></div>
        </div>
        <div style={{ padding: '10px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> Frequency</div>
          <div style={{ fontWeight: 600, color: type.color }}><TranslatedText text={type.frequency} /></div>
        </div>
        <div style={{ padding: '10px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ color: 'var(--text3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Fingerprint size={12} /> Voting</div>
          <div style={{ fontWeight: 600 }}><TranslatedText text={type.votingMethod} /></div>
        </div>
      </div>

      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 16, lineHeight: 1.6 }}>
        <TranslatedText text={type.description.slice(0, 110) + '...'} />
      </p>
    </div>
  );
}

export default function ElectionTypesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const etype = ELECTION_TYPES_DATA.find(t => t.id === typeParam);
      if (etype) {
        setSelectedType(etype);
      }
    }
  }, [searchParams]);

  if (selectedType) {
    return (
      <div className="page-wrapper animate-fade" style={{ background: 'var(--bg2)', minHeight: '100vh' }}>
        <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => setSelectedType(null)} 
            style={{ marginBottom: 24, padding: '8px 16px' }}
          >
            <ArrowLeft size={16} /> <TranslatedText text="Back to Election Types" />
          </button>

          <div className="card" style={{ borderTop: `8px solid ${selectedType.color}`, padding: '40px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
              <div style={{ fontSize: '4rem' }}>{selectedType.icon}</div>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>
                  <TranslatedText text={selectedType.title} />
                </h1>
                <div style={{ fontSize: '1.1rem', color: selectedType.color, fontWeight: 600 }}>
                  <TranslatedText text={selectedType.subtitle} />
                </div>
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: 32 }}>
              <TranslatedText text={selectedType.description} />
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
              <div style={{ padding: 20, background: 'var(--bg3)', borderRadius: 12 }}>
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={16} /> <TranslatedText text="What does it elect?" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}><TranslatedText text={selectedType.elects} /></div>
              </div>
              <div style={{ padding: 20, background: 'var(--bg3)', borderRadius: 12 }}>
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={16} /> <TranslatedText text="Frequency" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}><TranslatedText text={selectedType.frequency} /></div>
              </div>
              <div style={{ padding: 20, background: 'var(--bg3)', borderRadius: 12 }}>
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Fingerprint size={16} /> <TranslatedText text="Voting Method" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}><TranslatedText text={selectedType.votingMethod} /></div>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>
                <TranslatedText text="Key Points" />
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedType.keyPoints.map((point, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--text2)', lineHeight: 1.6 }}>
                    <CheckCircle2 size={20} style={{ color: selectedType.color, flexShrink: 0, marginTop: 2 }} />
                    <TranslatedText text={point} />
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: 24, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--primary-light)' }}>
                <TranslatedText text="Who Can Vote?" />
              </h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
                <TranslatedText text={selectedType.whoCanVote} />
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              <Link href="/representatives">
                 <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    🎖️ <TranslatedText text="Explore Political Positions" />
                 </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.05), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="badge badge-info" style={{ marginBottom: 16 }}>
            <Layers size={14} style={{ display: 'inline', marginRight: 6, marginBottom: -2 }} /> 
            <TranslatedText text="Electoral System" />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
            <TranslatedText text="Types of Elections" />
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            <TranslatedText text="India has a federal structure with elections occurring at multiple levels. Understand the difference between National, State, and Local elections." />
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {ELECTION_TYPES_DATA.map(type => (
            <ElectionTypeCard key={type.id} type={type} onSelect={setSelectedType} />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, gap: 16 }}>
           <Link href={ROUTES.LEARN}>
             <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <ArrowLeft size={16} /> <TranslatedText text="Back to Learn" />
             </button>
           </Link>
        </div>

      </div>
    </div>
  );
}
