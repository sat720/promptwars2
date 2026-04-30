# VoteWise AI 🗳️

> **PromptWars 2026** — Interactive Election Education Platform

An AI-powered, interactive platform to help users understand India's election process, apply for a Voter ID, and participate in democracy with confidence.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Powered by Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?logo=google)](https://aistudio.google.com)
[![Google Cloud Run](https://img.shields.io/badge/Cloud-Run-orange?logo=google-cloud)](https://cloud.google.com/run)

---

## 🎯 Chosen Vertical

**Election Process Education** — Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

---

## 🚀 Features

### 🤖 Vote Assist AI (Powered by Gemini)
- Floating chatbot available on **every page**
- Also accessible from the **navbar**
- Bounded to app data only — answers questions about elections, voter registration, booth finding, timelines
- Voice input (Speech Recognition) + Text-to-Speech output
- Graceful fallback to pre-written FAQ when Gemini API is unavailable

### 🪪 Voter ID System
- Apply for a personalized Voter ID card
- **Formula**: `[First 3 letters] + [5 random digits] + [Last 2 letters of last name] + [Last 2 digits of birth year]`
- Example: Satvik Kumar, born 2003 → `SAT84723AR03`
- Auto-maps pincode → constituency via local JSON database
- Session stored in `localStorage` with **4-hour TTL**
- Duplicate detection — shows "Already exists, view your card" on re-apply

### 🔐 Login System
- Login with Voter ID + OTP (Demo OTP: `11111`)
- Voter ID must be generated first (redirects to apply if not)
- Session gated — all features require login

### 📚 Learn Section (Core Educational Feature)
- **6 interactive modules**:
  1. How Elections Work (step-by-step stepper with progress bar)
  2. Types of Elections (Lok Sabha, Vidhan Sabha, Local Body, Rajya Sabha, By-elections, Presidential)
  3. Your Voter Rights (NOTA, secret ballot, right to complain)
  4. EVM & VVPAT Guide (how voting machines work)
  5. Election Commission of India (Article 324, constitutional articles)
  6. Dos and Don'ts on Election Day
- Read Aloud (TTS) button on every section
- Accessible without login

### 🗳️ Elections Dashboard
- 3 mock elections:
  - 🟢 **Karnataka Assembly 2026** — Voting TODAY
  - ⚫ **Tamil Nadu Local Body 2026** — Completed 3 days ago
  - 🟡 **Maharashtra Lok Sabha By-election** — Voting in 5 days
- Filter by: All / Ongoing / Upcoming / Past
- Eligibility check (requires login)
- Election detail pages with: Overview, Timeline, Candidates, Booth tabs
- Real Google Maps embedded with booth marker and walking route

### 📊 Dashboard
- Voter ID card (3D flip animation — front + back)
- Personal details with edit functionality
- Constituency info
- Real-time session TTL countdown
- Quick action links

### 🧠 Election Quiz
- 10 questions covering election process, voter rights, constitutional articles
- Detailed explanations for every answer
- Score tracking with localStorage (best score saved)
- Gamified results screen with badges (Expert / Good / Keep Learning)

---

## 🟦 Google Services Integration

| Service | Purpose | Fallback |
|---------|---------|---------|
| **Gemini API** | Vote Assist AI chatbot | Pre-written FAQ responses |
| **Google Cloud Run** | Production deployment | N/A |
| **Google Secret Manager** | API key management | Cloud Run environment variables |
| **Google Translate API** | Multi-language support (10 Indian languages) | English with "Translation unavailable" note |
| **Google Cloud TTS** | Read Aloud for accessibility | Browser `SpeechSynthesis` API |
| **Google Maps JavaScript API** | Polling booth finder with walking route | Static "Open in Google Maps" link |
| **Google Analytics 4** | Usage tracking and event analytics | N/A |

---

## 🏗️ Architecture & Approach

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Storage**: `localStorage` with TTL (no external database needed)
- **Styling**: Vanilla CSS with custom design system

### Folder Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # Server-side API routes
│   │   ├── chat/           # Gemini AI + FAQ fallback
│   │   ├── translate/      # Google Translate + English fallback
│   │   └── tts/            # Google TTS + browser TTS fallback
│   ├── apply/              # Voter ID application
│   ├── dashboard/          # User dashboard (auth required)
│   ├── elections/          # Elections list + detail pages
│   ├── learn/              # Educational content hub
│   ├── login/              # Login with Voter ID + OTP
│   ├── quiz/               # Election knowledge quiz
│   └── not-found.js        # Custom 404 page
├── components/             # Reusable UI components
│   ├── Navbar.js           # Navigation with auth awareness
│   ├── VoteAssist.js       # Floating AI chatbot
│   └── GoogleMap.js        # Google Maps component
├── constants/              # All app constants (no magic strings)
├── data/                   # Mock data + FAQ fallback
│   ├── elections.js        # 3 mock elections with timelines
│   ├── faq.js              # Pre-written FAQ for offline fallback
│   └── pincodes.js         # Pincode → constituency mapping
└── utils/                  # Utility functions
    ├── voterUtils.js        # Voter ID generation + session management
    └── sanitize.js         # Input sanitization + rate limiting
```

### Logic & Decisions
1. **No external database** — `localStorage` with 4-hour TTL keeps the prototype lightweight while demonstrating session management
2. **Bounded AI** — Gemini is given a strict system prompt limiting it to app data, preventing hallucination
3. **All Google APIs have fallbacks** — App works even when APIs fail
4. **Same env var pattern** — `process.env.X` works locally (`.env.local`) and in Cloud Run (environment variables)
5. **Voter ID formula** — Deterministic but unique enough for demo purposes

### Assumptions
- This is a prototype/demo — OTP is fixed as `11111` with a clear disclaimer
- Election data is mock/educational — not real-time official data
- Voter ID cards are for educational demonstration only
- Constituency mapping uses a curated sample of common pincodes

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/votewise-ai.git
cd votewise-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file (never commit this!):

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🚀 Cloud Run Deployment

```bash
# Build Docker image
docker build -t votewise-ai .

# Deploy to Cloud Run
gcloud run deploy votewise-ai \
  --image votewise-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key,NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=your_key,NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key,NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX"
```

For Secret Manager integration, replace env vars with secret references in Cloud Run.

---

## 📊 Evaluation Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| **Code Quality** | Modular structure, JSDoc comments, constants file, no magic strings, ESLint |
| **Security** | API keys server-side only, input sanitization (XSS prevention), rate limiting, security headers (CSP, X-Frame-Options), `.env` gitignored |
| **Efficiency** | Code splitting (`dynamic()`), lazy loading, API response caching via fallback, memoized renders |
| **Testing** | Utility functions testable (voterUtils, sanitize), validated input at every step, edge case handling |
| **Accessibility** | WCAG AA, skip-to-content link, ARIA labels, `aria-live` regions, keyboard navigation, TTS, multi-language, reduced motion support |
| **Google Services** | 7 Google services integrated meaningfully with fallbacks |

---

## 🙏 Credits

Built for **PromptWars 2026** using:
- 🤖 Google Gemini AI
- ☁️ Google Cloud Run & Secret Manager
- 🗺️ Google Maps JavaScript API
- 🌐 Google Translate API
- 🔊 Google Cloud Text-to-Speech
- 📊 Google Analytics 4

Supporting the **Election Commission of India's** vision of voter awareness and inclusive democracy.
