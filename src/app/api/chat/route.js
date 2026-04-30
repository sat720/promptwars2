/**
 * @fileoverview Gemini AI API route for Vote Assist chatbot
 * Includes fallback to pre-written FAQ when API is unavailable
 * @route POST /api/chat
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { findFAQResponse, DEFAULT_FALLBACK } from '@/data/faq';
import { sanitizeChatMessage } from '@/utils/sanitize';

/** System prompt that bounds the AI to our app's data only */
const SYSTEM_PROMPT = `You are "Vote Assist", an AI assistant for VoteWise AI — an interactive election education platform for India. Your purpose is to help users understand the Indian election process, navigate the VoteWise AI platform, and learn about voter rights and responsibilities.

STRICT RULES:
1. ONLY answer questions related to:
   - Indian election process and procedures
   - How to use the VoteWise AI platform (applying for Voter ID, logging in, finding booths, etc.)
   - Election types (Lok Sabha, Vidhan Sabha, Local Body)
   - Voter eligibility, rights, and registration
   - EVM and VVPAT information
   - Model Code of Conduct
   - Election timelines and stages
   - The 3 elections in our app: Karnataka Assembly 2026 (ONGOING TODAY), Tamil Nadu Local Body (PAST - 3 days ago), Maharashtra Lok Sabha By-election (UPCOMING - in 5 days)
   - Polling booths and voting day guidelines
   - Constitutional articles related to elections (Article 324, 326, etc.)

2. DO NOT answer questions about:
   - Real-time political news or current affairs
   - Specific politicians or their personal lives
   - Non-election related topics
   - Anything outside Indian elections and our platform

3. ALWAYS guide users to the relevant section of VoteWise AI:
   - Apply for Voter ID: /apply
   - Login: /login
   - Learn about elections: /learn
   - View all elections: /elections
   - Dashboard: /dashboard
   - Quiz: /quiz

4. Platform-specific information:
   - Demo OTP is always "11111"
   - Voter ID format: First 3 letters of first name + 5 random digits + Last 2 letters of last name + Last 2 digits of birth year (e.g., SAT84723AR03)
   - Session lasts 4 hours before user needs to re-register
   - If user already has Voter ID and tries to apply again, show "Already exists - View your card"

5. Election data in our platform:
   - Karnataka Assembly 2026: VOTING TODAY, 224 MLA seats, polling 7AM-6PM
   - Tamil Nadu Local Body 2026: COMPLETED 3 days ago
   - Maharashtra Lok Sabha By-election: Voting in 5 days, 1 MP seat (Pune)

6. Keep responses:
   - Concise but complete (under 200 words unless complex topic requires more)
   - Friendly and encouraging
   - In simple, easy-to-understand language
   - Use emojis sparingly for visual appeal

7. If asked about something outside your scope, say: "I can only help with election processes and VoteWise AI features. Try asking about voter registration, election timelines, or how to find your polling booth!"

Always respond in the same language the user writes in (English, Hindi, Telugu, Tamil, Kannada, etc.).`;

/**
 * POST handler for chat API
 * @param {Request} request - Next.js request object
 * @returns {Response} JSON response with AI message
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    // Sanitize input
    const sanitizedMessage = sanitizeChatMessage(message);
    if (!sanitizedMessage) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get API key — works in both local (.env.local) and Cloud Run (env vars)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to FAQ if no API key
      const faqMatch = findFAQResponse(sanitizedMessage);
      const response = faqMatch || DEFAULT_FALLBACK;
      return Response.json({
        message: response.answer,
        link: response.link || null,
        linkText: response.linkText || null,
        source: 'faq',
      });
    }

    // Try Gemini API
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      // Build chat history for context
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(sanitizedMessage);
      const responseText = result.response.text();

      return Response.json({
        message: responseText,
        source: 'gemini',
      });
    } catch (geminiError) {
      // Gemini failed — fallback to FAQ
      console.error('Gemini API error, falling back to FAQ:', geminiError.message);
      const faqMatch = findFAQResponse(sanitizedMessage);
      const response = faqMatch || DEFAULT_FALLBACK;

      return Response.json({
        message: response.answer,
        link: response.link || null,
        linkText: response.linkText || null,
        source: 'faq',
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({
      message: DEFAULT_FALLBACK.answer,
      link: DEFAULT_FALLBACK.link,
      linkText: DEFAULT_FALLBACK.linkText,
      source: 'fallback',
    }, { status: 200 }); // Return 200 even on error so UI handles gracefully
  }
}
