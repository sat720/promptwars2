'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVoterData, saveSession, hasValidVoterData } from '@/utils/voterUtils';
import { DEMO_OTP, ROUTES } from '@/constants';
import { sanitizeText } from '@/utils/sanitize';
import { Lock, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [voterId, setVoterId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const hasVoterData = hasValidVoterData();

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const cleanVoterId = sanitizeText(voterId.trim().toUpperCase(), 20);
    const cleanOtp = sanitizeText(otp.trim(), 10);

    if (!cleanVoterId) newErrors.voterId = 'Please enter your Voter ID';
    if (!cleanOtp) newErrors.otp = 'Please enter OTP';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate a small delay for realism
      await new Promise(r => setTimeout(r, 800));

      // Check voter data exists
      const voterData = getVoterData();
      if (!voterData) {
        setErrors({ voterId: 'Voter ID not found. Please apply first.' });
        setLoading(false);
        return;
      }

      // Check voter ID matches
      if (voterData.voterId !== cleanVoterId) {
        setErrors({ voterId: 'Invalid Voter ID. Please check and try again.' });
        setLoading(false);
        return;
      }

      // Check OTP
      if (cleanOtp !== DEMO_OTP) {
        setErrors({ otp: `Invalid OTP. Demo OTP is ${DEMO_OTP}` });
        setLoading(false);
        return;
      }

      // Success
      saveSession(cleanVoterId);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', { voter_id: cleanVoterId });
      }
      toast.success(`Welcome back, ${voterData.firstName}! 🗳️`);
      router.push(ROUTES.DASHBOARD);
    } catch {
      toast.error('Login failed. Please try again.');
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
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Login to VoteWise</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Enter your Voter ID and OTP to access your account</p>
        </div>

        <div className="card animate-fade">
          {/* Demo note */}
          <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', marginBottom: 24, fontSize: '0.8rem', color: 'var(--text2)' }}>
            <Info size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: 1 }} />
            <div><strong>Demo Mode:</strong> OTP is fixed as <strong style={{ color: 'var(--primary-light)', fontFamily: 'monospace' }}>11111</strong> for all users</div>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label className="label" htmlFor="voter-id-input">Your Voter ID *</label>
              <input
                id="voter-id-input"
                type="text"
                className={`input ${errors.voterId ? 'input-error' : ''}`}
                placeholder="e.g. SAT84723AR03"
                value={voterId}
                onChange={e => { setVoterId(e.target.value.toUpperCase()); setErrors({}); }}
                maxLength={20}
                required
                aria-required="true"
                aria-describedby={errors.voterId ? 'voter-id-error' : undefined}
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: 2, textTransform: 'uppercase' }}
              />
              {errors.voterId && <div id="voter-id-error" className="error-msg" role="alert">{errors.voterId}</div>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label" htmlFor="otp-input">OTP *</label>
              <input
                id="otp-input"
                type="text"
                className={`input ${errors.otp ? 'input-error' : ''}`}
                placeholder="Enter OTP (Demo: 11111)"
                value={otp}
                onChange={e => { setOtp(e.target.value); setErrors({}); }}
                maxLength={10}
                required
                aria-required="true"
                aria-describedby="otp-hint"
                inputMode="numeric"
              />
              <div id="otp-hint" style={{ fontSize: '0.75rem', color: 'var(--primary-light)', marginTop: 4 }}>
                🔑 Demo OTP: <strong>11111</strong> — Fixed for demonstration purposes
              </div>
              {errors.otp && <div className="error-msg" role="alert">{errors.otp}</div>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }} id="login-submit-btn">
              {loading ? '⏳ Verifying...' : <><Lock size={16} /> Login <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="divider" />

          <div style={{ textAlign: 'center' }}>
            {!hasVoterData ? (
              <div>
                <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 12 }}>Don&apos;t have a Voter ID yet?</p>
                <Link href={ROUTES.APPLY}>
                  <button className="btn btn-accent" style={{ width: '100%' }} id="login-apply-btn">
                    🪪 Apply for Voter ID
                  </button>
                </Link>
              </div>
            ) : (
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
                Found your Voter ID in this session — just enter it above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
