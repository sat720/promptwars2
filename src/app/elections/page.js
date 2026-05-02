'use client';

/**
 * @fileoverview Elections browse page for VoteWise AI
 * Responsive list with advanced filtering, state-wise groups, and Voice Search.
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ELECTIONS } from '@/data/elections';
import { ELECTION_STATUS, ELECTION_TYPES, ROUTES } from '@/constants';
import { Search, Filter, MapPin, Calendar, ChevronRight, CheckCircle, Vote, Info, Mic, MicOff } from 'lucide-react';
import { isLoggedIn, getVoterData } from '@/utils/voterUtils';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';
import toast from 'react-hot-toast';

export default function ElectionsPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showMyElections, setShowMyElections] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const loggedIn = isLoggedIn();
  const voterData = getVoterData();

  // Voice Search Implementation (Google STT / Web Speech)
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in your browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN'; // Basic mapping
    recognition.start();
    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
      toast.success(`Searching for: "${transcript}"`);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed');
    };
    
    recognition.onend = () => setIsListening(false);
  };

  const filteredElections = useMemo(() => {
    return ELECTIONS.filter(election => {
      const matchesSearch = (election?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                           (election?.state?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = activeFilter === 'all' || election.status === activeFilter;
      const matchesType = typeFilter === 'all' || election.type === typeFilter;
      
      let matchesMyElections = true;
      if (showMyElections && loggedIn && voterData) {
        matchesMyElections = election.state === voterData.state;
      }

      return matchesSearch && matchesStatus && matchesType && matchesMyElections;
    });
  }, [searchTerm, activeFilter, typeFilter, showMyElections, loggedIn, voterData]);

  // Group by state
  const groupedElections = useMemo(() => {
    const groups = {};
    filteredElections.forEach(e => {
      if (!groups[e.state]) groups[e.state] = [];
      groups[e.state].push(e);
    });
    return groups;
  }, [filteredElections]);

  return (
    <div className="page-wrapper" style={{ background: 'var(--bg2)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="badge badge-primary" style={{ marginBottom: 16 }}><Vote size={14} /> <TranslatedText text="Democratic Participation" /></div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>
            <TranslatedText text="Browse" /> <span className="gradient-text"><TranslatedText text="Elections" /></span>
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 600, margin: '0 auto' }}>
            <TranslatedText text="Explore all upcoming and ongoing elections across India. Filter by state, type, or status to find elections relevant to you." />
          </p>
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ marginBottom: 40, padding: 24 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
              <input
                type="text"
                className="input input-lg"
                placeholder={t('search_elections_placeholder', language)}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 44, paddingRight: 50 }}
              />
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
              <button 
                onClick={startVoiceSearch}
                className={`btn btn-ghost btn-icon ${isListening ? 'animate-pulse' : ''}`}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: isListening ? 'var(--danger)' : 'var(--primary)' }}
                aria-label="Voice Search"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <select className="input" value={activeFilter} onChange={e => setActiveFilter(e.target.value)} style={{ minWidth: 140 }}>
                <option value="all">{t('all_status', language)}</option>
                <option value={ELECTION_STATUS.ONGOING}>{t('ongoing', language)}</option>
                <option value={ELECTION_STATUS.UPCOMING}>{t('upcoming', language)}</option>
                <option value={ELECTION_STATUS.PAST}>{t('past', language)}</option>
              </select>
              <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ minWidth: 160 }}>
                <option value="all">{t('all_types', language)}</option>
                <option value={ELECTION_TYPES.LOK_SABHA}>{t('lok_sabha', language)}</option>
                <option value={ELECTION_TYPES.VIDHAN_SABHA}>{t('vidhan_sabha', language)}</option>
                <option value={ELECTION_TYPES.LOCAL_BODY}>{t('local_body', language)}</option>
              </select>
            </div>
          </div>

          <div className="flex-between" style={{ borderTop: '1px solid var(--border2)', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`toggle ${showMyElections ? 'active' : ''}`} onClick={() => {
                if (!loggedIn) {
                  toast('Please login to filter by your state', { icon: '🔐' });
                  return;
                }
                setShowMyElections(!showMyElections);
              }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text2)', fontWeight: 600 }}>
                <TranslatedText text="show_my_elections_only" />
              </span>
              {!loggedIn && <div className="badge badge-info" style={{ fontSize: '0.7rem' }}>LOGIN REQUIRED</div>}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
              Showing <strong>{filteredElections.length}</strong> elections
            </div>
          </div>
        </div>

        {/* Elections List Grouped by State */}
        {Object.keys(groupedElections).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {Object.keys(groupedElections).sort().map(state => (
              <div key={state}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MapPin size={20} color="var(--primary)" /> {state}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 10px', borderRadius: 20 }}>{groupedElections[state].length}</span>
                </h2>
                <div className="grid-3">
                  {groupedElections[state].map(election => (
                    <Link key={election.id} href={`/elections/${election.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card hover-glow" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${election.status === 'ongoing' ? 'var(--success)' : election.status === 'upcoming' ? 'var(--accent)' : 'var(--text3)'}` }}>
                        <div className="flex-between" style={{ marginBottom: 12 }}>
                          <div className={`badge ${election.status === 'ongoing' ? 'badge-success' : election.status === 'upcoming' ? 'badge-accent' : 'badge-info'}`} style={{ textTransform: 'capitalize' }}>
                            <TranslatedText text={election.status} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 700 }}>{election.type}</span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>{election.name}</h3>
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8 }}>
                            <Calendar size={14} /> <span>{election.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
                            <Info size={14} /> <span>{election.constituenciesCount} <TranslatedText text="Constituencies" /></span>
                          </div>
                        </div>
                        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <TranslatedText text="View Details" /> <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔍</div>
            <h2 style={{ fontWeight: 800, marginBottom: 12 }}><TranslatedText text="No elections found" /></h2>
            <p style={{ color: 'var(--text3)' }}><TranslatedText text="Try adjusting your filters or search terms." /></p>
            <button className="btn btn-outline" onClick={() => { setSearchTerm(''); setActiveFilter('all'); setTypeFilter('all'); setShowMyElections(false); }} style={{ marginTop: 24 }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
