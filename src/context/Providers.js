'use client';

import { LanguageProvider } from './LanguageContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <LanguageProvider>
      {children}
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
    </LanguageProvider>
  );
}
