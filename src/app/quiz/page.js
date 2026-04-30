'use client';

import { useState, useEffect } from 'react';
import { isLoggedIn } from '@/utils/voterUtils';
import { STORAGE_KEYS } from '@/constants';
import { CheckCircle, XCircle, Trophy, RotateCcw, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QUIZ_QUESTIONS = [
  { id: 1, question: 'What is the minimum age to vote in Indian elections?', options: ['16 years', '18 years', '21 years', '25 years'], correct: 1, explanation: 'Article 326 of the Indian Constitution grants voting rights to all citizens who are 18 years of age or older on the qualifying date.' },
  { id: 2, question: 'What does "NOTA" stand for?', options: ['No Other Than All', 'None of the Above', 'Not On The Agenda', 'None of These Answers'], correct: 1, explanation: 'NOTA (None of the Above) was introduced in 2013 following a Supreme Court order. It allows voters to reject all candidates without casting a blank vote.' },
  { id: 3, question: 'What is the Model Code of Conduct (MCC)?', options: ['A law governing candidate behavior', 'Guidelines for voter conduct at booths', 'Rules for political parties and candidates during elections', 'A code for EVM manufacturers'], correct: 2, explanation: 'The MCC is a set of guidelines issued by the Election Commission of India to regulate the conduct of political parties and candidates during the election period.' },
  { id: 4, question: 'How many seats are there in the Lok Sabha?', options: ['543', '250', '545', '552'], correct: 0, explanation: 'The Lok Sabha consists of 543 elected seats. 2 additional seats were for Anglo-Indians (abolished in 2020), bringing the total to 543 elected members.' },
  { id: 5, question: 'What is VVPAT?', options: ['Voter Verification Portal And Tracking', 'Voter Verified Paper Audit Trail', 'Verified Voting Poll And Tally', 'Voting Verification Process And Technology'], correct: 1, explanation: 'VVPAT (Voter Verified Paper Audit Trail) is a machine attached to the EVM that prints a paper slip showing the candidate voted for, visible for 7 seconds after casting a vote.' },
  { id: 6, question: 'Under which Article of the Constitution is the Election Commission of India established?', options: ['Article 315', 'Article 320', 'Article 324', 'Article 326'], correct: 2, explanation: 'Article 324 of the Indian Constitution provides for the establishment of the Election Commission of India and gives it superintendence, direction, and control of elections.' },
  { id: 7, question: 'What is the security deposit for a Lok Sabha candidate?', options: ['₹5,000', '₹10,000', '₹25,000', '₹50,000'], correct: 1, explanation: 'A candidate contesting a Lok Sabha election must deposit ₹10,000 as security. For Vidhan Sabha elections, the deposit is ₹5,000. General category candidates lose this deposit if they get less than ⅙ of votes polled.' },
  { id: 8, question: 'What voting system does India use for Lok Sabha elections?', options: ['Proportional Representation', 'First-Past-the-Post (FPTP)', 'Alternative Voting', 'Two-Round System'], correct: 1, explanation: 'India uses the First-Past-the-Post (FPTP) system, also called the plurality system. The candidate who gets the most votes in a constituency wins, even without an absolute majority.' },
  { id: 9, question: 'When does the Model Code of Conduct come into effect?', options: ['On the date of polling', '48 hours before polling', 'On the date of election announcement', 'On the last date of nominations'], correct: 2, explanation: 'The Model Code of Conduct comes into immediate effect on the date and time the election schedule is announced by the Election Commission of India.' },
  { id: 10, question: 'What is the "Silent Period" in elections?', options: ['Time when EVMs are sealed', 'Period between counting and results', '48 hours before polling begins when campaigning is banned', 'Time when election observers monitor polls'], correct: 2, explanation: 'The "Silent Period" refers to the 48-hour period before polling begins during which campaigning is strictly prohibited. This allows voters to make calm, uninfluenced decisions.' },
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORE);
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === QUIZ_QUESTIONS[current].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (current === QUIZ_QUESTIONS.length - 1) {
      setFinished(true);
      const newScore = score + (selected === QUIZ_QUESTIONS[current].correct ? 1 : 0);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem(STORAGE_KEYS.QUIZ_SCORE, newScore.toString());
      }
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'quiz_completed', { score: newScore, total: QUIZ_QUESTIONS.length });
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
      utt.lang = 'en-IN';
      window.speechSynthesis.speak(utt);
    }
  };

  const getScoreColor = (s) => s >= 8 ? 'var(--success)' : s >= 5 ? 'var(--accent)' : 'var(--danger)';
  const getScoreBadge = (s) => s >= 8 ? '🏆 Expert' : s >= 5 ? '⭐ Good' : '📚 Keep Learning';

  if (!started) {
    return (
      <div className="page-wrapper flex-center" style={{ minHeight: '100vh' }}>
        <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧠</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Election Knowledge Quiz</h1>
          <p style={{ color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
            Test your understanding of Indian elections with 10 questions covering voter rights, election process, and constitutional provisions.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            {['10 Questions', '📚 Election Topics', '✅ Detailed Explanations'].map(item => (
              <span key={item} className="badge badge-info">{item}</span>
            ))}
          </div>
          {bestScore > 0 && (
            <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.1)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Your best score: <strong style={{ color: 'var(--accent)' }}>{bestScore}/{QUIZ_QUESTIONS.length}</strong></div>
            </div>
          )}
          <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)} style={{ width: '100%' }} id="start-quiz-btn">
            🚀 Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const finalScore = score;
    return (
      <div className="page-wrapper flex-center" style={{ minHeight: '100vh' }}>
        <div className="card animate-bounce-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>{getScoreBadge(finalScore).split(' ')[0]}</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Quiz Completed!</h1>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: getScoreColor(finalScore), margin: '20px 0', fontFamily: 'Outfit, sans-serif' }}>
            {finalScore}/{QUIZ_QUESTIONS.length}
          </div>
          <div className="badge" style={{ background: `${getScoreColor(finalScore)}20`, color: getScoreColor(finalScore), fontSize: '0.9rem', padding: '8px 16px', marginBottom: 24 }}>
            {getScoreBadge(finalScore)}
          </div>
          <div className="progress-bar" style={{ marginBottom: 24 }}>
            <div className="progress-fill" style={{ width: `${(finalScore / QUIZ_QUESTIONS.length) * 100}%`, background: getScoreColor(finalScore) }} />
          </div>
          <p style={{ color: 'var(--text2)', marginBottom: 24, lineHeight: 1.6 }}>
            {finalScore >= 8 ? "Excellent! You're an election expert! 🎉" : finalScore >= 5 ? "Good job! Keep learning to score even higher." : "Keep exploring our Learn section to improve your knowledge!"}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleRestart} id="restart-quiz-btn"><RotateCcw size={16} /> Try Again</button>
            <a href="/learn"><button className="btn btn-outline" id="quiz-learn-btn">📚 Review in Learn</button></a>
          </div>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[current];
  const isCorrect = selected === q.correct;

  return (
    <div className="page-wrapper" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08), transparent 50%)' }}>
      <div className="container" style={{ maxWidth: 680, padding: '60px 24px' }}>
        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div className="flex-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Question {current + 1} of {QUIZ_QUESTIONS.length}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Score: {score}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((current) / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>
        </div>

        <div className="card">
          {/* Question */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4, flex: 1 }}>{q.question}</h2>
            <button onClick={() => speakQuestion(q.question)} className="btn btn-ghost btn-icon" aria-label="Read question aloud" style={{ marginLeft: 12, flexShrink: 0 }}>
              <Volume2 size={16} />
            </button>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`quiz-option ${answered && i === q.correct ? 'correct' : answered && i === selected && !isCorrect ? 'incorrect' : ''}`}
                aria-label={`Option ${i + 1}: ${option}`}
                aria-pressed={selected === i}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {answered && i === q.correct ? <CheckCircle size={16} color="var(--success)" /> : answered && i === selected && !isCorrect ? <XCircle size={16} color="var(--danger)" /> : String.fromCharCode(65 + i)}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="animate-fade" style={{
              padding: '14px 18px', borderRadius: 10, marginBottom: 20,
              background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              <div style={{ fontWeight: 700, color: isCorrect ? 'var(--success)' : 'var(--danger)', marginBottom: 6 }}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{q.explanation}</p>
            </div>
          )}

          <button onClick={handleNext} disabled={!answered} className="btn btn-primary" style={{ width: '100%' }} id={`quiz-next-btn-${current}`}>
            {current === QUIZ_QUESTIONS.length - 1 ? '🏆 See Results' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}
