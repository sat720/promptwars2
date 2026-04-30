'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ELECTIONS } from '@/data/elections';
import { ELECTION_STATUS, ROUTES } from '@/constants';
import { isLoggedIn, getVoterData } from '@/utils/voterUtils';
import { Filter, Calendar, MapPin, Users, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  [ELECTION_STATUS.ONGOING]: { label: 'Voting TODAY 🔴', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', badge: 'badge-success' },
  [ELECTION_STATUS.PAST]: { label: 'Completed', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', badge: 'badge-gray' },
  [ELECTION_STATUS.UPCOMING]: { label: 'Upcoming', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', badge: 'badge-warning' },
};

export default function ElectionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [loggedIn, setLoggedIn] = useState(false);
  const [voterData, setVoterData] = useState(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setVoterData(getVoterData());
  }, []);

  const filtered = filter === 'all' ? ELECTIONS : ELECTIONS.filter(e => e.status === filter);

  const handleElectionClick = (election) => {
    if (!loggedIn) {
      toast('Please login to view election details', { icon: '🔒' });
      router.push(ROUTES.LOGIN);
      return;
    }
    router.push(`/elections/${election.id}`);
  };

  const isEligible = (election) => {
    if (!voterData) return false;
    return election.state === voterData.state || election.type === 'Lok Sabha';
  };

  const filters = [
    { key: 'all', label: 'All Elections' },
    { key: ELECTION_STATUS.ONGOING, label: '🟢 Ongoing' },
    { key: ELECTION_STATUS.UPCOMING, label: '🟡 Upcoming' },
    { key: ELECTION_STATUS.PAST, label: '⚫ Past' },
  ];

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-info" style={{ marginBottom: 16 }}>🗳️ Election Dashboard</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12 }}>
            All <span className="gradient-text">Elections</span>
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
            Browse ongoing, upcoming, and past elections. Login to see your eligibility and access detailed information.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div className="tabs" style={{ display: 'inline-flex', gap: 4 }}>
            {filters.map(f => (
              <button key={f.key} className={`tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login notice if not logged in */}
        {!loggedIn && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 20px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, marginBottom: 32 }}>
            <Lock size={18} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text2)' }}>
              <strong>Login</strong> to see your eligibility status and access detailed election information, timelines, and booth finder.
            </div>
            <Link href={ROUTES.LOGIN}><button className="btn btn-primary btn-sm" id="elections-login-cta">Login</button></Link>
          </div>
        )}

        {/* Elections grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filtered.map(election => {
            const statusCfg = STATUS_CONFIG[election.status];
            const eligible = loggedIn && isEligible(election);

            return (
              <div
                key={election.id}
                className={`election-card ${election.status}`}
                onClick={() => handleElectionClick(election)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleElectionClick(election)}
                aria-label={`${election.name} - ${statusCfg.label}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="flex gap-12" style={{ alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{election.icon}</span>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{election.name}</h2>
                      <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
                      {loggedIn && (
                        <span className={`badge ${eligible ? 'badge-success' : 'badge-gray'}`}>
                          {eligible ? '✅ You can vote' : '❌ Not in your state'}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: 14, maxWidth: 600 }}>
                      {election.description}
                    </p>
                    <div className="flex gap-24" style={{ flexWrap: 'wrap', gap: 16 }}>
                      <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.8rem' }}>
                        <Calendar size={14} /> {new Date(election.votingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.8rem' }}>
                        <MapPin size={14} /> {election.state}
                      </div>
                      <div className="flex gap-8" style={{ alignItems: 'center', color: 'var(--text3)', fontSize: '0.8rem' }}>
                        <Users size={14} /> {election.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8" style={{ alignItems: 'center' }}>
                    {!loggedIn && <Lock size={16} style={{ color: 'var(--text3)' }} />}
                    <ChevronRight size={20} style={{ color: 'var(--text3)' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <p>No elections found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
