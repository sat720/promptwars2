'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getVoterData, isLoggedIn, clearSession, saveVoterData, createVoterData } from '@/utils/voterUtils';
import { formatDob, calculateAge } from '@/utils/voterUtils';
import { ROUTES, INDIAN_STATES } from '@/constants';
import { sanitizeName, sanitizePincode, validateDob, validateRequired, validatePincode } from '@/utils/sanitize';
import { Edit2, Download, LogOut, User, MapPin, Calendar, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/** Voter ID Card Component (Full) */
function VoterIdCard({ data, flipped, onFlip }) {
  return (
    <div style={{ perspective: 1000, width: '100%', maxWidth: 340, cursor: 'pointer' }} onClick={onFlip} title="Click to flip">
      <div style={{
        position: 'relative', width: '100%', paddingBottom: '62%',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Front */}
        <div className="voter-card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>ELECTION COMMISSION OF INDIA</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: 2 }}>ELECTORS PHOTO IDENTITY CARD</div>
            </div>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🗳️</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 48, height: 56, background: 'rgba(255,255,255,0.1)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {data.photo ? <img src={data.photo} alt="Voter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Name / नाम</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{data.fullName}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Voter ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#818cf8', letterSpacing: 1 }}>{data.voterId}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>DOB: {formatDob(data.dob)}</span>
                <span>{data.gender}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
            {data.address}, {data.city} - {data.pincode}
          </div>
          <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Click to flip ↻</div>
        </div>

        {/* Back */}
        <div className="voter-card voter-card-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 2 }}>CONSTITUENCY DETAILS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Assembly Constituency</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{data.constituency}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>State</div>
              <div style={{ fontWeight: 600 }}>{data.state}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Pincode</div>
              <div style={{ fontWeight: 600 }}>{data.pincode}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🇮🇳</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>INDIA</div>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: '5px 8px', background: 'rgba(99,102,241,0.2)', borderRadius: 5, fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>
            ⚠️ Demo Card — VoteWise AI Platform
          </div>
        </div>
      </div>
    </div>
  );
}

/** TTL Countdown */
function TTLCountdown({ expiresAt }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{remaining}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [voterData, setVoterData] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      toast.error('Please login first');
      router.push(ROUTES.LOGIN);
      return;
    }
    const data = getVoterData();
    setVoterData(data);
    setEditForm(data || {});
  }, [router]);

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully');
    router.push(ROUTES.HOME);
  };

  const handleSaveEdit = () => {
    const newErrors = {};
    const first = validateRequired(editForm.firstName, 'First name');
    if (!first.valid) newErrors.firstName = first.message;
    const addr = validateRequired(editForm.address, 'Address');
    if (!addr.valid) newErrors.address = addr.message;
    const pin = validatePincode(editForm.pincode);
    if (!pin.valid) newErrors.pincode = pin.message;
    if (!editForm.state) newErrors.state = 'State is required';
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updated = { ...voterData, ...editForm, fullName: `${editForm.firstName} ${editForm.lastName}` };
    saveVoterData(updated);
    setVoterData(updated);
    setEditing(false);
    toast.success('Details updated successfully!');
  };

  const handlePhotoEdit = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) { toast.error('Max 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setEditForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  if (!voterData) {
    return <div className="page-wrapper flex-center" style={{ minHeight: '100vh' }}><div className="skeleton" style={{ width: 300, height: 200 }} /></div>;
  }

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Dashboard</h1>
            <p style={{ color: 'var(--text2)' }}>Welcome back, <strong>{voterData.firstName}</strong>! 🗳️</p>
          </div>
          <div className="flex gap-12">
            <button className="btn btn-outline btn-sm" onClick={() => { setEditing(true); }} id="edit-details-btn">
              <Edit2 size={14} /> Edit Details
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="dashboard-logout-btn">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Personal info card */}
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} style={{ color: 'var(--primary)' }} /> Personal Details
              </h2>
              {!editing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['Full Name', voterData.fullName],
                    ['Voter ID', voterData.voterId],
                    ['Date of Birth', formatDob(voterData.dob)],
                    ['Age', `${calculateAge(voterData.dob)} years`],
                    ['Gender', voterData.gender],
                    ['Pincode', voterData.pincode],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{k}</div>
                      <div style={{ fontWeight: 600, color: k === 'Voter ID' ? 'var(--primary-light)' : 'var(--text)', fontFamily: k === 'Voter ID' ? 'monospace' : 'inherit' }}>{v}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label" htmlFor="edit-first">First Name</label>
                      <input id="edit-first" className="input" value={editForm.firstName || ''} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                      {editErrors.firstName && <div className="error-msg">{editErrors.firstName}</div>}
                    </div>
                    <div>
                      <label className="label" htmlFor="edit-last">Last Name</label>
                      <input id="edit-last" className="input" value={editForm.lastName || ''} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="edit-address">Address</label>
                    <textarea id="edit-address" className="input" value={editForm.address || ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} rows={2} style={{ resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label" htmlFor="edit-state">State</label>
                      <select id="edit-state" className="input" value={editForm.state || ''} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="edit-pincode">Pincode</label>
                      <input id="edit-pincode" className="input" value={editForm.pincode || ''} onChange={e => setEditForm(f => ({ ...f, pincode: sanitizePincode(e.target.value) }))} maxLength={6} />
                      {editErrors.pincode && <div className="error-msg">{editErrors.pincode}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="btn btn-primary" onClick={handleSaveEdit} id="save-edit-btn">Save Changes</button>
                    <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setEditForm(voterData); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Constituency info */}
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> Constituency Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Assembly', voterData.constituency],
                  ['State', voterData.state],
                  ['City', voterData.city],
                  ['Pincode', voterData.pincode],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <Link href={ROUTES.ELECTIONS} style={{ display: 'block', marginTop: 16 }}>
                <button className="btn btn-outline btn-sm" style={{ width: '100%' }} id="dashboard-elections-btn">🗳️ View Elections in My State</button>
              </Link>
            </div>

            {/* Session TTL */}
            <div className="card" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex gap-12" style={{ alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Session Expires In</div>
                  <div style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    <TTLCountdown expiresAt={voterData.expiresAt} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Voter ID card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
            <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <h2 style={{ fontWeight: 700, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} style={{ color: 'var(--primary)' }} /> Your Voter ID Card
              </h2>
              <VoterIdCard data={voterData} flipped={cardFlipped} onFlip={() => setCardFlipped(f => !f)} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', textAlign: 'center' }}>Click card to flip and see constituency details</p>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ width: '100%' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href={ROUTES.ELECTIONS} style={{ width: '100%' }}>
                  <button className="btn btn-primary" style={{ width: '100%' }} id="dashboard-view-elections-btn">🗳️ View My Elections</button>
                </Link>
                <Link href={ROUTES.LEARN} style={{ width: '100%' }}>
                  <button className="btn btn-outline" style={{ width: '100%' }} id="dashboard-learn-btn">📚 Learn About Elections</button>
                </Link>
                <Link href="/quiz" style={{ width: '100%' }}>
                  <button className="btn btn-outline" style={{ width: '100%' }} id="dashboard-quiz-btn">🧠 Take Election Quiz</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
