'use client';

/**
 * @fileoverview Navbar component for VoteWise AI
 * Responsive navigation with auth-aware links, theme toggle, language selector
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, clearSession, getVoterData } from '@/utils/voterUtils';
import { ROUTES, APP_META, SUPPORTED_LANGUAGES, STORAGE_KEYS } from '@/constants';
import { LogOut, User, Moon, Sun, Globe, Menu, X, BookOpen, Vote, LayoutDashboard, Home } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Navbar component
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
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

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    setTheme(savedTheme);
    setLanguage(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);

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

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    toast.success(`Language changed`);
  };

  const navLinks = [
    { href: ROUTES.HOME, label: 'Home', icon: <Home size={16} /> },
    { href: ROUTES.LEARN, label: 'Learn', icon: <BookOpen size={16} /> },
    { href: ROUTES.ELECTIONS, label: 'Elections', icon: <Vote size={16} /> },
    ...(loggedIn ? [{ href: ROUTES.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={16} /> }] : []),
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex gap-8" style={{ alignItems: 'center', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.4rem' }}>🗳️</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
            Vote<span className="gradient-text">Wise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="flex gap-8" style={{ alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex gap-8"
              style={{
                alignItems: 'center',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive(link.href) ? 'var(--primary-light)' : 'var(--text2)',
                background: isActive(link.href) ? 'rgba(99,102,241,0.1)' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '6px',
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex gap-8" style={{ alignItems: 'center' }}>
          {/* Language selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={language}
              onChange={e => changeLanguage(e.target.value)}
              aria-label="Select language"
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                color: 'var(--text2)', padding: '6px 10px', borderRadius: '8px',
                fontSize: '0.8rem', cursor: 'pointer',
              }}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.nativeLabel}</option>
              ))}
            </select>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Vote Assist in navbar */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openVoteAssist'))}
            className="btn btn-outline btn-sm"
            aria-label="Open Vote Assist AI"
            id="navbar-vote-assist-btn"
          >
            🤖 Vote Assist
          </button>

          {/* Auth buttons */}
          {loggedIn ? (
            <div className="flex gap-8" style={{ alignItems: 'center' }}>
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex gap-8" style={{ alignItems: 'center', padding: '6px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px' }}>
                  <User size={16} style={{ color: 'var(--primary-light)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600 }}>{voterName}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-icon" aria-label="Logout" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-8">
              <Link href={ROUTES.APPLY}>
                <button className="btn btn-accent btn-sm" id="navbar-apply-btn">Apply</button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <button className="btn btn-primary btn-sm" id="navbar-login-btn">Login</button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{ display: 'none' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border2)',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--text)', fontWeight: 500 }}>
              {link.icon} {link.label}
            </Link>
          ))}
          {!loggedIn && (
            <>
              <Link href={ROUTES.APPLY} onClick={() => setMobileOpen(false)}>
                <button className="btn btn-accent" style={{ width: '100%' }}>Apply for Voter ID</button>
              </Link>
              <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                <button className="btn btn-primary" style={{ width: '100%' }}>Login</button>
              </Link>
            </>
          )}
          {loggedIn && (
            <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%' }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
