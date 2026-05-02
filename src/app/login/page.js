'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { getVoterData, saveSession, isLoggedIn } from '@/utils/voterUtils';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';
import { LogIn, Shield, ArrowRight, Info, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [voterId, setVoterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanVoterId = voterId.trim().toUpperCase();
    if (!cleanVoterId || cleanVoterId.length < 10) {
      setErrors({ voterId: t('invalid_voter_id_format', language) });
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const voterData = getVoterData();
      
      if (voterData && voterData.voterId === cleanVoterId) {
        saveSession(cleanVoterId);
        toast.success(t('login_success', language));
        router.push(ROUTES.DASHBOARD);
      } else {
        setErrors({ voterId: t('voter_id_not_found', language) });
      }
    } catch {
      toast.error(t('login_failed', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1), transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="badge badge-primary" style={{ marginBottom: 16 }}>🔐 <TranslatedText text="Secure Access" /></div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}><TranslatedText text="Login to" /> <span className="gradient-text">VoteWise AI</span></h1>
          <p style={{ color: 'var(--text2)' }}>
            <TranslatedText text="Enter your Voter ID to access your digital card and election details." />
          </p>
        </div>

        <div className="card animate-fade">
          <form onSubmit={handleLogin} noValidate>
            <div style={{ marginBottom: 24 }}>
              <label className="label" htmlFor="voter-id-input"><TranslatedText text="Voter ID Card Number" /></label>
              <div style={{ position: 'relative' }}>
                <input
                  id="voter-id-input"
                  className={`input input-lg ${errors.voterId ? 'input-error' : ''}`}
                  placeholder={t('voter_id_placeholder', language)}
                  value={voterId}
                  onChange={e => { setVoterId(e.target.value.toUpperCase()); setErrors({}); }}
                  style={{ paddingLeft: 44 }}
                />
                <Shield size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
              </div>
              {errors.voterId && <div className="error-msg" role="alert">{errors.voterId}</div>}
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>
                <TranslatedText text="Format: 10 uppercase alphanumeric characters (e.g., ABC1234567)" />
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }} id="login-submit-btn">
              {loading ? t('verifying', language) : <><LogIn size={18} /> <TranslatedText text="Login" /> <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="divider" />

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
              <TranslatedText text="New to the platform?" /> <Link href={ROUTES.APPLY} className="link" id="login-apply-link"><TranslatedText text="Apply for Voter ID" /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
