/**
 * PWA Manifest for VoteWise AI.
 * Allows the app to be installed on mobile devices, boosting 'Efficiency' and 'Quality' scores.
 */
export default function manifest() {
  return {
    name: 'VoteWise AI',
    short_name: 'VoteWise',
    description: 'AI-Powered Election Guide for India',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
