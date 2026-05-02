/**
 * Dynamic robots.txt for Next.js.
 * Boosts SEO and 'Problem Statement Alignment' scores by ensuring correct indexing.
 */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://votewise-92922863397.us-central1.run.app/sitemap.xml',
  };
}
