'use client';

/**
 * @fileoverview Navbar component for VoteWise AI
 * Responsive navigation with auth-aware links, theme toggle, language selector
 * Optimized layout to prevent profile name cutoff.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, clearSession, getVoterData } from '@/utils/voterUtils';
import { ROUTES, APP_META, SUPPORTED_LANGUAGES, STORAGE_KEYS } from '@/constants';
import { LogOut, User, Moon, Sun, Globe, Menu, X, BookOpen, Vote, LayoutDashboard, Home, Users, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    }
    return 'dark';
  });
  const { language, changeLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [voterName, setVoterName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(isLoggedIn());
      const voterData = getVoterData();
      if (voterData) setVoterName(voterData.firstName);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearSession();
    setLoggedIn(false);
    toast.success('Logged out successfully');
    router.push(ROUTES.HOME);
    setMobileOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    toast.success(`${SUPPORTED_LANGUAGES.find(l => l.code === code)?.label} selected`);
  };

  const navLinks = [
    { href: ROUTES.HOME, label: t('home', language), icon: <Home size={16} /> },
    { href: ROUTES.LEARN, label: t('learn', language), icon: <BookOpen size={16} /> },
    { href: ROUTES.ELECTIONS, label: t('elections', language), icon: <Vote size={16} /> },
    { href: '/representatives', label: t('political_positions', language), icon: <Users size={16} /> },
    { href: '/election-types', label: t('types_of_elections_in_india', language), icon: <Layers size={16} /> },
    ...(loggedIn ? [{ href: ROUTES.DASHBOARD, label: t('dashboard', language), icon: <LayoutDashboard size={16} /> }] : []),
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation" style={{ height: '80px' }}>
      <div className="navbar-inner" style={{ padding: '0 24px', gap: '12px', maxWidth: '100%', width: '100%' }}>
        
        {/* Logo block */}
        <div style={{ flexShrink: 0 }}>
          <Link href={ROUTES.HOME} className="flex gap-8" style={{ alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🗳️</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: 'var(--text)' }}>
              Vote<span className="gradient-text">Wise</span>
            </span>
          </Link>
        </div>

        {/* Nav Links (Flexible center) */}
        <div className="desktop-only flex" style={{ alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex"
              style={{
                alignItems: 'center',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive(link.href) ? 'var(--primary-light)' : 'var(--text2)',
                background: isActive(link.href) ? 'rgba(99,102,241,0.1)' : 'transparent',
                transition: 'all 0.2s',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right side controls block */}
        <div className="flex gap-8" style={{ alignItems: 'center', flexShrink: 0 }}>
          <select
            value={language}
            onChange={e => handleLanguageChange(e.target.value)}
            className="desktop-only"
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              color: 'var(--text2)', padding: '6px 4px', borderRadius: '8px',
              fontSize: '0.75rem', cursor: 'pointer',
            }}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.nativeLabel}</option>
            ))}
          </select>

          <button onClick={toggleTheme} className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openVoteAssist'))}
            className="btn btn-outline btn-sm desktop-only"
            style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            aria-label="Open AI Vote Assist Chat"
          >
            🤖 {t('vote_assist', language)}
          </button>

          {loggedIn ? (
            <div className="flex gap-6" style={{ alignItems: 'center' }}>
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex gap-6" style={{ alignItems: 'center', padding: '6px 10px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px' }}>
                  <User size={14} style={{ color: 'var(--primary-light)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700, whiteSpace: 'nowrap' }}>{voterName}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-6">
              <Link href={ROUTES.APPLY}>
                <button className="btn btn-accent btn-sm" style={{ fontSize: '0.75rem' }}>{t('apply', language)}</button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <button className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem' }}>{t('login', language)}</button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon mobile-only"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 80, left: 0, right: 0, zIndex: 999,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border2)',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto'
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ padding: '12px', borderRadius: '12px', color: 'var(--text)', fontWeight: 600, background: isActive(link.href) ? 'rgba(99,102,241,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {link.icon} {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border2)', margin: '8px 0' }} />
          <div className="flex gap-12" style={{ padding: '0 12px' }}>
             <select
                value={language}
                onChange={e => handleLanguageChange(e.target.value)}
                style={{
                  background: 'var(--bg3)', border: '1px solid var(--border2)',
                  color: 'var(--text2)', padding: '8px', borderRadius: '8px',
                  fontSize: '0.85rem', flex: 1
                }}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.nativeLabel}</option>
                ))}
              </select>
          </div>
        </div>
      )}
    </nav>
  );
}
