'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createVoterData, saveVoterData, hasValidVoterData, getVoterData } from '@/utils/voterUtils';
import { sanitizeName, sanitizePincode, validateDob, validateRequired, validatePincode } from '@/utils/sanitize';
import { INDIAN_STATES, ROUTES } from '@/constants';
import { Upload, User, ArrowRight, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ApplyPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '', address: '', city: '', state: '', pincode: '', photo: null,
  });
  const [errors, setErrors] = useState({});

  // Check if voter ID already exists
  const alreadyExists = hasValidVoterData();
  const existingData = getVoterData();

  const validate = () => {
    const newErrors = {};
    const first = validateRequired(form.firstName, 'First name');
    if (!first.valid) newErrors.firstName = first.message;
    const last = validateRequired(form.lastName, 'Last name');
    if (!last.valid) newErrors.lastName = last.message;
    const dob = validateDob(form.dob);
    if (!dob.valid) newErrors.dob = dob.message;
    if (!form.gender) newErrors.gender = 'Gender is required';
    const addr = validateRequired(form.address, 'Address');
    if (!addr.valid) newErrors.address = addr.message;
    const city = validateRequired(form.city, 'City');
    if (!city.valid) newErrors.city = city.message;
    if (!form.state) newErrors.state = 'State is required';
    const pin = validatePincode(form.pincode);
    if (!pin.valid) newErrors.pincode = pin.message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be less than 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setForm(f => ({ ...f, photo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    setLoading(true);
    try {
      const cleanForm = {
        ...form,
        firstName: sanitizeName(form.firstName),
        lastName: sanitizeName(form.lastName),
        city: sanitizeName(form.city),
        pincode: sanitizePincode(form.pincode),
      };
      const voterData = createVoterData(cleanForm);
      saveVoterData(voterData);
      setGeneratedData(voterData);
      setStep(2);
      // GA event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'voter_id_generated', { voter_id: voterData.voterId, state: voterData.state });
      }
      toast.success('Voter ID generated successfully! 🎉');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, id, error, children }) => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
      {error && <div className="error-msg" role="alert">{error}</div>}
    </div>
  );

  if (alreadyExists && step !== 2) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🪪</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Voter ID Already Exists!</h1>
          <p style={{ color: 'var(--text2)', marginBottom: 8 }}>You already have a Voter ID:</p>
          <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: 'var(--primary-light)', fontWeight: 700, padding: '12px 20px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 24 }}>
            {existingData?.voterId}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href={ROUTES.LOGIN}><button className="btn btn-primary" id="existing-login-btn"><Eye size={16} /> View My Card</button></Link>
            <Link href={ROUTES.HOME}><button className="btn btn-outline" id="existing-home-btn">Go Home</button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2 && generatedData) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card animate-bounce-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Your Voter ID is Ready!</h1>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Welcome to Indian democracy, {generatedData.firstName}!</p>
          <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 24, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
              {[
                ['Full Name', generatedData.fullName],
                ['Voter ID', generatedData.voterId],
                ['Date of Birth', new Date(generatedData.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Gender', generatedData.gender],
                ['State', generatedData.state],
                ['Constituency', generatedData.constituency],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>{k}</div>
                  <div style={{ fontWeight: 600, color: k === 'Voter ID' ? 'var(--primary-light)' : 'var(--text)', fontFamily: k === 'Voter ID' ? 'monospace' : 'inherit' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="badge badge-warning" style={{ marginBottom: 20 }}>⏱️ Valid for 4 hours — Session stored in your browser</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href={ROUTES.LOGIN}><button className="btn btn-primary btn-lg" id="success-login-btn">Login Now <ArrowRight size={18} /></button></Link>
            <Link href={ROUTES.HOME}><button className="btn btn-outline" id="success-home-btn">Go Home</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.1), transparent 60%)' }}>
      <div className="container" style={{ maxWidth: 680, padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🪪</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Apply for Voter ID</h1>
          <p style={{ color: 'var(--text2)' }}>Fill in your details to generate your unique Voter ID card</p>
        </div>

        <form onSubmit={handleSubmit} className="card" noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="First Name *" id="firstName" error={errors.firstName}>
              <input id="firstName" className={`input ${errors.firstName ? 'input-error' : ''}`} placeholder="Satvik" value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} maxLength={50} required aria-required="true" />
            </Field>
            <Field label="Last Name *" id="lastName" error={errors.lastName}>
              <input id="lastName" className={`input ${errors.lastName ? 'input-error' : ''}`} placeholder="Kumar" value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} maxLength={50} required aria-required="true" />
            </Field>
            <Field label="Date of Birth *" id="dob" error={errors.dob}>
              <input id="dob" type="date" className={`input ${errors.dob ? 'input-error' : ''}`} value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} max={new Date().toISOString().split('T')[0]} required aria-required="true" />
            </Field>
            <Field label="Gender *" id="gender" error={errors.gender}>
              <select id="gender" className={`input ${errors.gender ? 'input-error' : ''}`} value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} required aria-required="true">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <div style={{ marginTop: 20 }}>
            <Field label="Address *" id="address" error={errors.address}>
              <textarea id="address" className={`input ${errors.address ? 'input-error' : ''}`} placeholder="House No, Street, Area" value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} maxLength={200} required aria-required="true" style={{ resize: 'vertical' }} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 20 }}>
            <Field label="City *" id="city" error={errors.city}>
              <input id="city" className={`input ${errors.city ? 'input-error' : ''}`} placeholder="Bangalore" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} maxLength={50} required aria-required="true" />
            </Field>
            <Field label="State *" id="state" error={errors.state}>
              <select id="state" className={`input ${errors.state ? 'input-error' : ''}`} value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required aria-required="true">
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Pincode *" id="pincode" error={errors.pincode}>
              <input id="pincode" className={`input ${errors.pincode ? 'input-error' : ''}`} placeholder="560001" value={form.pincode}
                onChange={e => setForm(f => ({ ...f, pincode: sanitizePincode(e.target.value) }))} maxLength={6} required aria-required="true" inputMode="numeric" />
            </Field>
          </div>

          {/* Photo upload */}
          <div style={{ marginTop: 20 }}>
            <label className="label">Photo (optional)</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div onClick={() => fileRef.current?.click()} style={{
                width: 80, height: 80, border: '2px dashed var(--border2)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                background: 'var(--bg3)',
              }}>
                {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={28} style={{ color: 'var(--text3)' }} />}
              </div>
              <div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                  <Upload size={14} /> Upload Photo
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 6 }}>JPG, PNG — max 2MB</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} aria-label="Upload photo" />
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,158,11,0.1)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.8rem', color: 'var(--text2)' }}>
            ⏱️ Your Voter ID will be stored for <strong>4 hours</strong> in your browser. After that, you can apply again.
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 24 }} id="apply-submit-btn">
            {loading ? <><span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span> Generating...</> : <><CheckCircle size={18} /> Generate My Voter ID</>}
          </button>
        </form>
      </div>
    </div>
  );
}
