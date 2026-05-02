'use client';

import { useState, useEffect, useRef } from 'react';

// In-memory cache to prevent redundant API calls during the session
const translationCache = {};

/**
 * Hook to translate text using the Google Translate API
 * @param {string} text - Original English text
 * @param {string} targetLanguage - Language code (e.g., 'hi', 'te')
 * @returns {{ translated: string, loading: boolean }}
 */
export function useTranslate(text, targetLanguage) {
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);
  const lastCallRef = useRef({ text: '', lang: '' });

  useEffect(() => {
    // Reset to original if language is English or no text
    if (!text || !targetLanguage || targetLanguage === 'en') {
      const timer = setTimeout(() => {
        setTranslated(text);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Return cached value if exists
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      const timer = setTimeout(() => {
        setTranslated(translationCache[cacheKey]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Prevent duplicate calls for the same state update
    if (lastCallRef.current.text === text && lastCallRef.current.lang === targetLanguage) {
      return;
    }

    const translate = async () => {
      setLoading(true);
      lastCallRef.current = { text, lang: targetLanguage };

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage }),
        });

        const data = await response.json();
        
        if (data.translatedText) {
          translationCache[cacheKey] = data.translatedText;
          setTranslated(data.translatedText);
        } else {
          setTranslated(text);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslated(text);
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [text, targetLanguage]);

  return { translated, loading };
}
