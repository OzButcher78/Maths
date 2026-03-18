# CLAUDE.md — Mathe-Meister Project Guide

## Project Overview
**Mathe-Meister** is a math practice game for children aged 6–14. Built with React 19, TypeScript, Vite, and Tailwind CSS (CDN). Uses Google Gemini API for leaderboard name moderation.

---

## Key Files — Where to Look First

| Purpose | File |
|---|---|
| All game state & flow | `App.tsx` |
| Question generation & AI difficulty | `services/gameLogic.ts` |
| Scoring constants & multipliers | `constants.ts` |
| All TypeScript types/interfaces | `types.ts` |
| i18n translations (EN) | `public/locales/en.json` |
| i18n translations (DE) | `public/locales/de.json` |
| Sound effects (Web Audio API + wav) | `hooks/useSounds.ts` |
| Gemini name validation | `services/geminiService.ts` |
| Entry point (React mount) | `index.tsx` |
| HTML shell + Tailwind CDN | `index.html` |

---

## Architecture

```
index.html → index.tsx → App.tsx (state hub)
                              ↓
           LocalizationContext (i18n, wraps entire app)
                              ↓
              Game state routes to one screen at a time:
              MenuScreen | GameScreen | GameOverScreen |
              Leaderboard | StatsScreen | Static pages
```

- **State lives entirely in `App.tsx`** — all game logic, answer checking, scoring, and transitions are there. Components are mostly presentational.
- **No router** — game state enum drives which component is shown.
- **No CSS framework files** — Tailwind is loaded via CDN in `index.html`.
- **Localization** — use the `useLocalization()` hook from `context/LocalizationContext.tsx`. All user-facing strings must have entries in both `en.json` and `de.json`.

---

## Game State Flow

```
menu → (multiplicationSetup?) → playing → gameOver → stats → menu
                                                ↓
                                           leaderboard
```

GameState type is in `types.ts`. Transitions are handled in `App.tsx`.

---

## App.tsx State Reference

| State variable | Type | Purpose |
|---|---|---|
| `gameState` | `GameState` | Which screen is rendered |
| `difficulty` | `Difficulty \| null` | Selected difficulty |
| `operation` | `Operation \| null` | Selected operation |
| `gameMode` | `GameMode \| null` | Regular or Time Attack |
| `questionCount` | `number` | Questions answered this session |
| `lives` | `number` | Remaining lives (regular mode) |
| `score` | `number` | Current score |
| `streak` | `number` | Current consecutive correct answers |
| `question` | `Question \| null` | Active question |
| `answerFeedback` | `'correct' \| 'incorrect' \| null` | Drives feedback UI and ConfettiEffect |
| `currentMultiplier` | `number` | Score multiplier (changes in AI mode) |
| `timer` | `number` | Seconds remaining (Time Attack) |
| `performanceStats` | `PerformanceStats` | Per-operation accuracy for StatsScreen |
| `aiTierProgress` | `AiTierProgress` | Tracks accuracy per tier; drives AI difficulty tier selection |
| `weakQuestions` | `Question[]` | Spaced repetition pool (max 10); wrong answers added here, 30% re-serve chance |
| `lastPoints` | `number \| null` | Last points scored; feeds FloatingScore popup |
| `showPointsPopup` | `boolean` | Triggers the FloatingScore component |

---

## Scoring System (constants.ts)
- Correct: +2 pts, Incorrect: −2 pts (flat, not multiplied)
- Difficulty multipliers: easy ×1, medium ×2, hard ×3
- Streak bonuses (reduced to discourage guessing): 3:+1, 6:+2, 10:+4, 15:+6, 20:+10
- AI mode: 5-tier progressive difficulty, score multiplier increases at Q21 (2.5×) and Q41 (3.5×)
- Time Attack: configurable duration (60s / 5min / 10min), special multiplier logic (easy gets 1.5×)

---

## AI Mode — Tier Progression

AI difficulty no longer uses raw `questionCount` to select a number range. Instead:

1. `aiTierProgress` (type `AiTierProgress`) tracks correct/total counts per tier (1–5).
2. After each answer, App.tsx evaluates accuracy on the current tier:
   - **Advance** (tier +1) if accuracy ≥ 85% after at least 5 questions on that tier.
   - **Retreat** (tier −1) if accuracy < 60%.
3. The active tier is converted to a `questionCount` equivalent via `aiTierToQuestionCount()` helper in `App.tsx`, which is then passed to `generateQuestion`.
4. The score multiplier is still determined by raw `questionCount` thresholds (Q21 → 2.5×, Q41 → 3.5×).

---

## Spaced Repetition

- `weakQuestions: Question[]` in App state — capped at 10 entries.
- When a player answers incorrectly, the question is added to `weakQuestions`.
- `generateQuestion` receives `weakQuestions` as a parameter.
- On each call, there is a **30% chance** a question is drawn from `weakQuestions` instead of generated fresh.
- The pool resets on game reset (not persisted across sessions — see `bug.md` monitoring notes).

---

## Adding New Features — Checklist

1. **New game text** → add key to both `public/locales/en.json` and `public/locales/de.json`
2. **New game constant** → add to `constants.ts`
3. **New type** → add to `types.ts`
4. **New component** → add to `components/`, consume via `App.tsx`
5. **New sound** → add wav file to `public/wizard/`, register in `hooks/useSounds.ts` (add to preload list in `unlockAudio` and create a `playWav` call)
6. **Always** → after every change, modification, update, or new feature, add an entry to `CHANGELOG.md` with the date and a short description of what changed.

---

## New Component Quick Reference

| Component | Props | Notes |
|---|---|---|
| `ConfettiEffect` | `trigger: boolean` | Particle burst on correct answer. Rendered in GameScreen, triggered when `answerFeedback === 'correct'`. |
| `FloatingScore` | `amount: number \| null`, `visible: boolean`, `onComplete: () => void` | Floating "+N" popup on correct answer. `onComplete` clears `showPointsPopup` in App state. |

---

## Known Patterns

**Sound effects:**
- Mix of synthesized tones (Web Audio API oscillators) and wav files in `public/wizard/`.
- Wav files: `wrong.wav` (incorrect answer), `magic.wav` (splash/milestones), `defeat.wav` (game over), `powerup.wav` (available for future use).
- All wav files are preloaded into an `AudioBuffer` cache on `unlockAudio()` for instant playback.
- `isMuted` / `toggleMute` exist in useSounds but are not currently exposed in the UI (mute button was removed — users control volume via device).
- On streak milestones, only the splash screen sound (magic.wav) plays — no separate streak sound.

**Spaced repetition:**
- `weakQuestions` lives in App state → passed as a parameter to `generateQuestion` → 30% chance of re-serving a wrong question from the pool.

**AI tier vs. score multiplier:**
- Tier (1–5) controls question difficulty range in `generateQuestion`.
- Score multiplier is a separate concept driven by raw `questionCount` thresholds in `constants.ts`.

---

## Development

```bash
npm install
# Set GEMINI_API_KEY in .env.local
npm run dev       # localhost:3000
npm run build     # production bundle → dist/
npm run preview   # preview production build
```

---

## Environment Variables
- `GEMINI_API_KEY` — required for leaderboard name moderation (Gemini 2.5 Flash). Set in `.env.local`.

---

## Constraints & Gotchas
- **Tailwind via CDN** — no purging, no custom Tailwind config file. All styles are inline utility classes.
- **Leaderboard in localStorage** — top 20 scores only, no backend. Key: `mathWhizLeaderboard`.
- **Gemini name check is async** — `GameOverScreen.tsx` has loading state during validation.
- **Keypad debounce** — 100ms lock in `Keypad.tsx` to prevent rapid multi-submit.
- **Audio** — Web Audio API for synthesized tones + preloaded wav files (`public/wizard/*.wav`). AudioContext created on first user interaction via `unlockAudio()`. If never called, all sounds silently no-op. No mute button in UI — users control volume via device.
- **No React Router** — do not add a router; use the existing GameState enum pattern.
- **Wrong-answer display** — held for 3 seconds (was 2s) to give children time to process the mistake.
