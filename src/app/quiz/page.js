'use client';

/**
 * @fileoverview Localized Quiz page for VoteWise AI
 * Supports all 8 languages and provides educational feedback.
 */

import { useState, useEffect } from 'react';
import { isLoggedIn } from '@/utils/voterUtils';
import { STORAGE_KEYS } from '@/constants';
import { CheckCircle, XCircle, Trophy, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { QUIZ_DATA } from '@/data/quiz';
import TranslatedText from '@/components/TranslatedText';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { language } = useLanguage();
  const questions = QUIZ_DATA[language] || QUIZ_DATA['en'];
  
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORE);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (current === questions.length - 1) {
      setFinished(true);
      const finalTotal = score + (selected === questions[current].correct && !answered ? 1 : 0); // Logic fix
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem(STORAGE_KEYS.QUIZ_SCORE, score.toString());
      }
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setStarted(false);
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(text);
      // Map app language to BCP47
      const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN' };
      utt.lang = langMap[language] || 'en-IN';
      window.speechSynthesis.speak(utt);
    }
  };

  if (!started) {
    return (
    <main className="page-wrapper flex-center" style={{ minHeight: '100vh' }}>
      <section className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }} aria-labelledby="quiz-start-title">
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧠</div>
        <h1 id="quiz-start-title" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}><TranslatedText text="Election Knowledge Quiz" /></h1>
        <p style={{ color: 'var(--text2)', marginBottom: 24, lineHeight: 1.6 }}>
          <TranslatedText text="Test your understanding of Indian elections with questions covering voter rights, election process, and constitutional provisions." />
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
          <span className="badge badge-info">{questions.length} <TranslatedText text="Questions" /></span>
          <span className="badge badge-success">✅ <TranslatedText text="Localized" /></span>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)} style={{ width: '100%' }} aria-label="Start Quiz Now">
          🚀 <TranslatedText text="Start Quiz" />
        </button>
      </section>
    </main>
    );
  }

    <main className="page-wrapper flex-center" style={{ minHeight: '100vh' }}>
      <section className="card animate-bounce-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }} aria-labelledby="quiz-finished-title">
        <Trophy size={60} color="var(--accent)" style={{ marginBottom: 16, margin: '0 auto' }} />
        <h1 id="quiz-finished-title" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}><TranslatedText text="Quiz Completed!" /></h1>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-light)', margin: '20px 0' }}>
          {score}/{questions.length}
        </div>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
          <TranslatedText text={score >= 4 ? "Excellent work! You are an informed citizen." : "Good effort! Keep learning about our democracy."} />
        </p>
        <button className="btn btn-primary" onClick={handleRestart} style={{ width: '100%' }} aria-label="Restart Quiz">
          <RotateCcw size={18} /> <TranslatedText text="Try Again" />
        </button>
      </section>
    </main>

  const q = questions[current];

  return (
    <main className="page-wrapper flex-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <header style={{ marginBottom: 24 }}>
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text3)' }}><TranslatedText text="Question" /> {current + 1} / {questions.length}</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }} aria-label={`Current score: ${score}`}><TranslatedText text="Score" />: {score}</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={((current + 1) / questions.length) * 100} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </header>

        <section className="card" aria-labelledby="question-text">
          <div className="flex-between" style={{ marginBottom: 24, alignItems: 'flex-start' }}>
            <h2 id="question-text" style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.5 }}>{q.question}</h2>
            <button onClick={() => speakQuestion(q.question)} className="btn btn-ghost btn-icon" style={{ flexShrink: 0, marginLeft: 16 }} aria-label="Read question aloud">
              <Volume2 size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }} role="radiogroup" aria-labelledby="question-text">
            {q.options.map((opt, i) => (
              <button
                key={i}
                disabled={answered}
                onClick={() => handleSelect(i)}
                className={`quiz-option ${answered && i === q.correct ? 'correct' : answered && i === selected ? 'incorrect' : ''}`}
                aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', border: '1px solid var(--border2)', background: 'var(--bg3)', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s', fontWeight: 600, display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                   {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </button>
            ))}
          </div>

          {answered && (
            <div className="animate-fade" style={{ padding: 16, background: 'rgba(99,102,241,0.05)', borderRadius: 12, border: '1px solid var(--border2)', marginBottom: 24 }} role="alert">
              <div style={{ fontWeight: 700, color: selected === q.correct ? 'var(--success)' : 'var(--danger)', marginBottom: 8 }}>
                {selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.5 }}>{q.explanation}</p>
            </div>
          )}

          <button disabled={!answered} onClick={handleNext} className="btn btn-primary" style={{ width: '100%' }} aria-label={current === questions.length - 1 ? "Finish Quiz" : "Next Question"}>
            {current === questions.length - 1 ? <><TranslatedText text="Finish Quiz" /> <Trophy size={18} /></> : <><TranslatedText text="Next Question" /> <ArrowRight size={18} /></>}
          </button>
        </section>
      </div>
    </main>
  );
}
