'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
      <div>
        <div style={{ fontSize: '5rem', marginBottom: 24 }}>🗳️</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 8 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          Lost your way? Just like finding your polling booth, we&apos;ll get you back on track!
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={ROUTES.HOME}><button className="btn btn-primary btn-lg">🏠 Go Home</button></Link>
          <Link href={ROUTES.LEARN}><button className="btn btn-outline btn-lg">📚 Learn About Elections</button></Link>
        </div>
      </div>
    </div>
  );
}
