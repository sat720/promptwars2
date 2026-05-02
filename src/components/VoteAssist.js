'use client';

/**
 * @fileoverview VoteAssist floating chatbot component
 * Available on every page via layout. Opens as a slide-in panel from right.
 * Uses Gemini API with FAQ fallback.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { sanitizeChatMessage } from '@/utils/sanitize';
import { RATE_LIMIT, STORAGE_KEYS, SUPPORTED_LANGUAGES } from '@/constants';
import { checkRateLimit } from '@/utils/sanitize';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';
import TranslatedText from '@/components/TranslatedText';
import { Send, X, Bot, ChevronDown, Mic, MicOff, Volume2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/** Suggested starter questions */
const SUGGESTED_QUESTIONS = [
  'How do I get my Voter ID?',
  'What elections are happening today?',
  'How does voting with EVM work?',
  'What is NOTA?',
  'How to find my polling booth?',
  'What is Model Code of Conduct?',
];

/**
 * VoteAssist chatbot component
 * @returns {JSX.Element}
 */
export default function VoteAssist() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const [messages, setMessages] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
        if (saved) {
          const history = JSON.parse(saved);
          if (history.length > 0) return history;
        }
      }
    } catch {}
    return [];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for open event from navbar button
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openVoteAssist', handleOpen);
    return () => window.removeEventListener('openVoteAssist', handleOpen);
  }, []);

  // Save chat history
  useEffect(() => {
    try {
      // Keep only last 20 messages
      const toSave = messages.slice(-20);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(toSave));
    } catch {}
  }, [messages]);

  /** Sends a message to the API */
  const sendMessage = useCallback(async (text) => {
    const sanitized = sanitizeChatMessage(text || input);
    if (!sanitized || loading) return;

    // Rate limit check
    if (!checkRateLimit('chat', RATE_LIMIT.CHAT_PER_MINUTE)) {
      toast.error('Too many messages. Please wait a moment.');
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: sanitized,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history for context (last 10 messages)
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitized, history }),
      });

      const data = await response.json();

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.message || "I couldn't process that. Please try again.",
        link: data.link || null,
        linkText: data.linkText || null,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm having connectivity issues. Please try again in a moment!",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, messages, loading]);

  /** Handle Enter key */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /** TTS — speak AI message */
  const speakMessage = async (text) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.replace(/\*\*/g, '').replace(/•/g, ''), languageCode: 'en-IN' }),
      });
      const data = await response.json();

      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play();
      } else {
        // Browser TTS fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
          utterance.lang = 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  /** Voice input */
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in your browser');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  /** Format message text (bold, bullets) */
  const formatMessage = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</span>
      ));
    });
  };

  return (
    <>
      {/* Floating button and tooltip */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        {!open && (
          <div style={{
            background: 'var(--bg)', padding: '10px 16px', borderRadius: '20px 20px 4px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--border)',
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)',
            animation: 'bounce 2s infinite', transformOrigin: 'bottom right',
            cursor: 'pointer'
          }} onClick={() => setOpen(true)}>
            💭 <TranslatedText text="Any doubt? Ask me!" />
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Open Vote Assist AI chatbot"
          aria-expanded={open}
          id="vote-assist-float-btn"
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
            animation: open ? 'none' : 'pulse 2s ease infinite',
            transition: 'all 0.3s',
          }}
        >
          {open ? <X size={24} /> : '🤖'}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Vote Assist AI Chatbot"
          aria-modal="false"
          className="animate-slide-right"
          style={{
            position: 'fixed', bottom: 88, right: 24, zIndex: 999,
            width: 360, height: 520, maxHeight: 'calc(100vh - 120px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div className="flex gap-12" style={{ alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Vote Assist</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Powered by Gemini AI ✨</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }} aria-label="Close chatbot">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-bubble ${msg.role}`}>
                  {formatMessage(msg.content)}
                  {msg.link && (
                    <Link href={msg.link} style={{ display: 'block', marginTop: 8, padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.8rem', color: 'white', textAlign: 'center' }}>
                      {msg.linkText || msg.link}
                    </Link>
                  )}
                </div>
                {msg.role === 'ai' && (
                  <button onClick={() => speakMessage(msg.content)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', marginTop: 4, padding: '2px 4px' }} aria-label="Read aloud" title="Read aloud">
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="chat-bubble ai" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: `pulse 1s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}

            {/* Suggested questions (when only welcome message) */}
            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text2)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border2)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={toggleListening} aria-label={listening ? 'Stop listening' : 'Voice input'}
              style={{ background: listening ? 'rgba(239,68,68,0.2)' : 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: 8, cursor: 'pointer', color: listening ? 'var(--danger)' : 'var(--text3)', flexShrink: 0 }}>
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={listening ? 'Listening...' : 'Ask about elections...'}
              disabled={loading || listening}
              aria-label="Type your question"
              className="input"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.875rem', margin: 0 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="btn btn-primary btn-icon"
              style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, padding: 0 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
