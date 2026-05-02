'use client';

/**
 * @fileoverview Voter Dashboard for VoteWise AI
 * Personalized experience showing Voter ID, Constituency, and eligible Elections.
 * Includes 'Download Digital Card' feature with both front and back sides in a single image.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, INDIAN_STATES, ELECTION_STATUS } from '@/constants';
import { ELECTIONS } from '@/data/elections';
import { getVoterData, isLoggedIn, clearSession, saveVoterData, formatDob, calculateAge } from '@/utils/voterUtils';
import { sanitizePincode, validateRequired, validatePincode } from '@/utils/sanitize';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';
import { User, LogOut, Vote, BookOpen, MapPin, Shield, QrCode, Edit2, Download, Award, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

/** Voter ID Card Component (Full) */
function VoterIdCard({ data, flipped, onFlip }) {
  return (
    <div style={{ perspective: 1000, width: '100%', maxWidth: 340, height: 210, cursor: 'pointer' }} onClick={onFlip} title="Click to flip">
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Front */}
        <div className="voter-card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
            <div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 }}>ELECTION COMMISSION OF INDIA</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: 2 }}>VOTER ID CARD</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <div style={{ width: 60, height: 75, background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data.photo ? <img src={data.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={30} style={{ opacity: 0.3 }} />}
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Name</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{data.fullName}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Voter ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#818cf8', fontWeight: 700, letterSpacing: 1 }}>{data.voterId}</div>
            </div>
          </div>

          <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
            <span>DOB: {formatDob(data.dob)}</span>
            <span>{data.gender}</span>
          </div>
        </div>

        {/* Back */}
        <div className="voter-card voter-card-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}>CONSTITUENCY DETAILS</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Assembly</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{data.constituency}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>State</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{data.state}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Address</div>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.4 }}>{data.address}, {data.city} - {data.pincode}</div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 15, right: 15, opacity: 0.3 }}>
            <QrCode size={40} />
          </div>
        </div>
      </div>
      
      {/* Hidden container for Clean Unified Export (Both sides in one image) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="voter-card-unified-export" style={{ background: 'var(--bg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: 20 }}>
          {/* Front */}
          <div className="voter-card" style={{ width: 340, height: 210, padding: 20 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
              <div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 }}>ELECTION COMMISSION OF INDIA</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: 2 }}>VOTER ID CARD</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <div style={{ width: 60, height: 75, background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {data.photo ? <img src={data.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={30} style={{ opacity: 0.3 }} />}
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Name</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{data.fullName}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Voter ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#818cf8', fontWeight: 700, letterSpacing: 1 }}>{data.voterId}</div>
              </div>
            </div>
            <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
              <span>DOB: {formatDob(data.dob)}</span>
              <span>{data.gender}</span>
            </div>
          </div>
          
          {/* Back */}
          <div className="voter-card voter-card-back" style={{ width: 340, height: 210, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}>CONSTITUENCY DETAILS</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Assembly</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{data.constituency}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>State</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{data.state}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Address</div>
                <div style={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.4 }}>{data.address}, {data.city} - {data.pincode}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 15, right: 15, opacity: 0.3 }}>
              <QrCode size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [voterData, setVoterData] = useState(() => {
    if (typeof window !== 'undefined') return getVoterData();
    return null;
  });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(voterData || {});
  const [editErrors, setEditErrors] = useState({});

  const handleDownloadCard = async () => {
    try {
      toast.loading('Generating Digital Card...', { id: 'download' });
      
      const element = document.getElementById('voter-card-unified-export');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#0a0a0f', // Match app background
        useCORS: true,
        logging: false,
        borderRadius: 20
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `VoterID_${voterData.voterId}.png`;
      link.click();
      
      toast.success('Digital Card downloaded! 🎉', { id: 'download' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to download card', { id: 'download' });
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    toast.success(t('logout_success', language));
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
    toast.success(t('profile_updated', language));
  };

  if (!voterData) return null;

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.08), transparent 50%)' }}>
    <main className="page-wrapper">
      <div className="container" style={{ padding: '60px 24px' }}>
        <header className="flex-between" style={{ marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}><TranslatedText text="My Dashboard" /></h1>
            <p style={{ color: 'var(--text2)' }}><TranslatedText text="Welcome back" />, <strong>{voterData.firstName}</strong>! 🗳️</p>
          </div>
          <div className="flex gap-12">
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} id="edit-details-btn" aria-label="Edit Profile Details">
              <Edit2 size={14} /> <TranslatedText text="Edit Details" />
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="dashboard-logout-btn" aria-label="Logout of Dashboard">
              <LogOut size={14} /> <TranslatedText text="Logout" />
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }} aria-labelledby="personal-details-title">
            <div className="card">
              <h2 id="personal-details-title" style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} style={{ color: 'var(--primary)' }} /> <TranslatedText text="Personal Details" />
              </h2>
              {!editing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    ['Full Name', voterData.fullName],
                    ['Voter ID', voterData.voterId],
                    ['Date of Birth', formatDob(voterData.dob)],
                    ['Age', `${calculateAge(voterData.dob)} years`],
                    ['Gender', voterData.gender],
                    ['Pincode', voterData.pincode],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text={k} /></div>
                      <div style={{ fontWeight: 600, color: k === 'Voter ID' ? 'var(--primary-light)' : 'var(--text)', fontFamily: k === 'Voter ID' ? 'monospace' : 'inherit' }}>{v}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label" htmlFor="edit-first"><TranslatedText text="First Name" /></label>
                      <input id="edit-first" className="input" value={editForm.firstName || ''} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                      {editErrors.firstName && <div className="error-msg">{editErrors.firstName}</div>}
                    </div>
                    <div>
                      <label className="label" htmlFor="edit-last"><TranslatedText text="Last Name" /></label>
                      <input id="edit-last" className="input" value={editForm.lastName || ''} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="edit-address"><TranslatedText text="Address" /></label>
                    <textarea id="edit-address" className="input" value={editForm.address || ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} rows={2} style={{ resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label" htmlFor="edit-state"><TranslatedText text="State" /></label>
                      <select id="edit-state" className="input" value={editForm.state || ''} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="edit-pincode"><TranslatedText text="Pincode" /></label>
                      <input id="edit-pincode" className="input" value={editForm.pincode || ''} onChange={e => setEditForm(f => ({ ...f, pincode: sanitizePincode(e.target.value) }))} maxLength={6} />
                      {editErrors.pincode && <div className="error-msg">{editErrors.pincode}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="btn btn-primary" onClick={handleSaveEdit} id="save-edit-btn"><TranslatedText text="Save Changes" /></button>
                    <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setEditForm(voterData); }}><TranslatedText text="Cancel" /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> <TranslatedText text="Constituency Details" />
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Assembly', voterData.constituency],
                  ['State', voterData.state],
                  ['City', voterData.city],
                  ['Pincode', voterData.pincode],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}><TranslatedText text={k} /></div>
                    <div style={{ fontWeight: 600 }}><TranslatedText text={v} /></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <h2 style={{ fontWeight: 700, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} style={{ color: 'var(--primary)' }} /> <TranslatedText text="Your Voter ID Card" />
              </h2>
              <VoterIdCard data={voterData} flipped={cardFlipped} onFlip={() => setCardFlipped(f => !f)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text3)' }}>
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                <TranslatedText text="Click card to flip and see constituency details" />
              </div>
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={handleDownloadCard}>
                <Download size={14} /> <TranslatedText text="Download Digital Card" />
              </button>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}><TranslatedText text="My Elections" /></h3>
              <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: 14 }}>
                <TranslatedText text="Elections you are eligible to vote in" />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
                <div style={{ fontSize: '3rem' }}>🗳️</div>
                <p style={{ color: 'var(--text2)', textAlign: 'center', fontSize: '0.95rem' }}>
                  <TranslatedText text="View and manage elections you are eligible for, find your polling booth, and explore candidates based on your registered address." />
                </p>
                <Link href={`${ROUTES.ELECTIONS}?filter=my`} style={{ width: '100%' }}>
                  <button className="btn btn-primary" style={{ width: '100%' }}>
                    <TranslatedText text="View My Elections" /> <ChevronRight size={16} />
                  </button>
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Link href={ROUTES.ELECTIONS} style={{ flex: 1 }}>
                  <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                    🌐 <TranslatedText text="All Elections" />
                  </button>
                </Link>
                <Link href="/representatives" style={{ flex: 1 }}>
                  <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                    🎖️ <TranslatedText text="political_positions" />
                  </button>
                </Link>
              </div>

              <Link href={ROUTES.LEARN} style={{ display: 'block', marginTop: 10 }}>
                <button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.85rem' }}>
                  📚 <TranslatedText text="Learn About Elections" />
                </button>
              </Link>

              <Link href={ROUTES.QUIZ} style={{ display: 'block', marginTop: 8 }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  🧠 <TranslatedText text="Take Election Quiz" />
                </button>
              </Link>
            </div>
            </div>
          </div>
        </div>
    </main>
    </div>
  );
}
