/**
 * @fileoverview Root layout for VoteWise AI
 * Sets up metadata, fonts, analytics, and global providers
 */

import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { APP_META } from '@/constants';
import Navbar from '@/components/Navbar';
import VoteAssist from '@/components/VoteAssist';
import { Toaster } from 'react-hot-toast';

/** @type {import('next').Metadata} */
export const metadata = {
  title: `${APP_META.NAME} — Interactive Election Education Platform`,
  description: APP_META.DESCRIPTION,
  keywords: 'election, voter id, India elections, how to vote, election process, voter registration, EVM, constituency',
  authors: [{ name: 'VoteWise AI Team' }],
  robots: 'index, follow',
  openGraph: {
    title: APP_META.NAME,
    description: APP_META.DESCRIPTION,
    type: 'website',
  },
};

/**
 * Root layout component
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Analytics */}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        {/* Accessibility: Skip to main content */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <Navbar />

        <main id="main-content">
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            {children}
          </Suspense>
        </main>

        {/* Global Vote Assist floating chatbot */}
        <VoteAssist />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#16213e',
              color: '#f1f5f9',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
