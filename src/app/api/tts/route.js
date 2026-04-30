/**
 * @fileoverview Google Cloud Text-to-Speech API route for VoteWise AI
 * Converts text to audio for accessibility support
 * @route POST /api/tts
 */

import { sanitizeText } from '@/utils/sanitize';

/**
 * POST handler for TTS API
 * @param {Request} request - Next.js request object
 * @returns {Response} JSON response with base64 audio content
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, languageCode = 'en-IN' } = body;

    // Validate input
    const sanitizedText = sanitizeText(text, 1000);
    if (!sanitizedText) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get API key — works in both local and Cloud Run
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
      return Response.json({
        audioContent: null,
        source: 'fallback',
        note: 'TTS unavailable — use browser TTS',
        text: sanitizedText,
      });
    }

    // Try Google Cloud TTS
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: sanitizedText },
            voice: {
              languageCode,
              ssmlGender: 'NEUTRAL',
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 1.0,
              pitch: 0,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS API returned ${response.status}`);
      }

      const data = await response.json();
      const audioContent = data.audioContent;

      if (!audioContent) {
        throw new Error('No audio content returned');
      }

      return Response.json({ audioContent, source: 'google' });
    } catch (ttsError) {
      // Fallback — tell client to use browser TTS
      console.error('TTS API error:', ttsError.message);
      return Response.json({
        audioContent: null,
        source: 'fallback',
        note: 'Using browser text-to-speech',
        text: sanitizedText,
      });
    }
  } catch (error) {
    console.error('TTS route error:', error);
    return Response.json({ error: 'TTS failed' }, { status: 500 });
  }
}
