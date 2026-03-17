<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mathe-Meister

A math practice game for children aged 6–14. Supports addition, subtraction, multiplication, and division with progressive difficulty, streaks, a leaderboard, and full English/German localization.

View on AI Studio: https://ai.studio/apps/drive/1Fo-Uu_P7LGpHcDQZVtRWsFrinWApYLLX

---

## Recent Changes — v2.2

- **AI mode tier progression** — difficulty advances when accuracy reaches 85% on the current tier; retreats below 60%. No longer driven by raw question count alone.
- **Spaced repetition** — wrong answers are added to a session pool and re-served with 30% probability.
- **Per-number-range accuracy** — Stats screen shows accuracy broken down per operation.
- **Mute toggle** — sound on/off button on the menu screen.
- **Confetti and floating score effects** — particle burst and floating "+N" popup on correct answers.
- **Flame streak indicator** — 🔥 emoji that grows in size and intensity with streak count, replacing bolt icons.
- **Timer progress bar** — Time Attack timer is now a colour-shifting bar (green → yellow → red).
- **Reduced streak bonuses** — bonuses reduced to reward learning over guessing (3:+1, 6:+2, 10:+4, 15:+6, 20:+10).
- **Wrong-answer display extended** — wrong answer shown for 3 seconds (was 2s) so children have time to process mistakes.

---

## Quick Start

**Prerequisites:** Node.js

```bash
npm install
# Add your Gemini API key to .env.local:
# GEMINI_API_KEY=your_key_here
npm run dev       # http://localhost:3000
npm run build     # production bundle → dist/
npm run preview   # serve production build locally
```

---

## File Structure

```
mathe/
├── index.html                          # HTML shell, Tailwind CSS CDN, font imports
├── index.tsx                           # React entry point, mounts App in LocalizationProvider
├── App.tsx                             # Central state hub — all game logic & screen routing
├── constants.ts                        # Scoring values, multipliers, streak bonuses, durations
├── types.ts                            # TypeScript interfaces (GameState, Difficulty, Operation, etc.)
├── vite.config.ts                      # Vite config (port 3000, API_KEY injection, path alias)
├── tsconfig.json                       # TypeScript config (ES2022, JSX react-jsx, @/* alias)
├── package.json                        # Dependencies & npm scripts
├── metadata.json                       # AI Studio app metadata
│
├── components/
│   ├── MenuScreen.tsx                  # Main menu — difficulty/operation/mode selection, mute toggle
│   ├── GameScreen.tsx                  # Active game — question, input, score, lives, timer
│   ├── GameOverScreen.tsx              # End screen — score summary, name entry, Gemini validation
│   ├── Leaderboard.tsx                 # Top 20 scores from localStorage
│   ├── StatsScreen.tsx                 # Per-operation accuracy breakdown
│   ├── MultiplicationSetupScreen.tsx   # Times table selector (1–12)
│   ├── Keypad.tsx                      # Numeric keypad (0–9, backspace, submit) with debounce
│   ├── SplashScreen.tsx                # Achievement overlays (streak milestones, progress)
│   ├── StreakIndicator.tsx             # Flame emoji (🔥) indicator that grows with streak count, replaces bolt icons
│   ├── ConfettiEffect.tsx              # Confetti burst animation on correct answers
│   ├── FloatingScore.tsx               # Floating "+N" score popup on correct answers
│   ├── LanguageSelector.tsx            # EN/DE toggle
│   ├── AboutPage.tsx                   # About page
│   ├── RulesPage.tsx                   # Game rules
│   ├── ScoringPage.tsx                 # Scoring explanation
│   ├── PrivacyPage.tsx                 # Privacy policy
│   ├── TermsPage.tsx                   # Terms of use
│   ├── ImpressumPage.tsx               # Legal / Impressum
│   └── icons/                          # SVG icon components
│       ├── BackIcon.tsx
│       ├── BackspaceIcon.tsx
│       ├── ChevronDownIcon.tsx
│       ├── CrossIcon.tsx
│       ├── LifeIcon.tsx
│       ├── LostLifeIcon.tsx
│       ├── PlayIcon.tsx
│       ├── StarIcon.tsx
│       ├── ThumbsUpIcon.tsx
│       └── TickIcon.tsx
│
├── context/
│   └── LocalizationContext.tsx         # i18n context — useLocalization() hook, EN/DE support
│
├── hooks/
│   └── useSounds.ts                    # Web Audio API — synthesized sound effects; isMuted state & toggleMute
│
├── services/
│   ├── gameLogic.ts                    # generateQuestion() — difficulty tiers, AI mode, spaced repetition
│   └── geminiService.ts               # isNameInappropriate() — Gemini 2.5 Flash name moderation
│
└── public/
    └── locales/
        ├── en.json                     # English UI strings (300+ keys)
        └── de.json                     # German translations (parallel structure)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2 |
| Language | TypeScript 5.8 |
| Build tool | Vite 6.2 |
| Styling | Tailwind CSS (CDN, no config file) |
| AI / moderation | Google Gemini 2.5 Flash (`@google/genai`) |
| Audio | Web Audio API (no audio files) |
| Storage | localStorage (leaderboard, top 20) |
| i18n | Custom context + JSON locale files |
| Spaced Repetition | Custom (in-session weak question pool, max 10 entries) |

---

## Game Modes & Scoring

**Operations:** Addition, Subtraction, Multiplication, Division, Random

**Difficulties:**
- Easy — ×1 score multiplier
- Medium — ×2 score multiplier
- Hard — ×3 score multiplier
- AI — accuracy-based 5-tier difficulty progression; score multiplier increases at Q21 (×2.5) and Q41 (×3.5)

**Game Modes:**
- Regular — 3 lives, unlimited time
- Time Attack — configurable duration (60s / 5min / 10min), no life limit

**Streak Bonuses:** +1 at ×3, +2 at ×6, +4 at ×10, +6 at ×15, +10 at ×20 consecutive correct answers

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for leaderboard name moderation |

Set in `.env.local` (not committed to git).
