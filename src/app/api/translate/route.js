/**
 * @fileoverview Google Translate API route for VoteWise AI
 * Translates text to supported Indian languages
 * @route POST /api/translate
 */

import { sanitizeText } from '@/utils/sanitize';

/**
 * POST handler for translation API
 * @param {Request} request - Next.js request object
 * @returns {Response} JSON response with translated text
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

    // Validate inputs
    const sanitizedText = sanitizeText(text, 2000);
    if (!sanitizedText) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }
    if (!targetLanguage || targetLanguage === 'en') {
      return Response.json({ translatedText: sanitizedText, source: 'passthrough' });
    }

    // Get API key — works in both local and Cloud Run
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
      return Response.json({
        translatedText: sanitizedText,
        source: 'fallback',
        note: 'Translation unavailable',
      });
    }

    // Try Google Translate API
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: sanitizedText,
            target: targetLanguage,
            format: 'text',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translate API returned ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data?.translations?.[0]?.translatedText;

      if (!translatedText) {
        throw new Error('No translation returned');
      }

      return Response.json({ translatedText, source: 'google' });
    } catch (translateError) {
      // Fallback — return original text with note
      console.error('Translate API error:', translateError.message);
      return Response.json({
        translatedText: sanitizedText,
        source: 'fallback',
        note: 'Translation temporarily unavailable. Showing in English.',
      });
    }
  } catch (error) {
    console.error('Translate route error:', error);
    return Response.json({ error: 'Translation failed' }, { status: 500 });
  }
}
