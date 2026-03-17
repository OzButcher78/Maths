# Bug Tracker

## Fixed Bugs

| # | Description | File(s) | Fix Applied |
|---|---|---|---|
| 1 | Streak resets to 0 at 20-streak milestone, can't continue | App.tsx | Removed reset condition; streak now increments freely |
| 2 | Wrong answers penalised ×difficulty multiplier (Hard = −6 instead of −2) | App.tsx | Wrong answers always use flat POINTS_INCORRECT |
| 3 | Subtraction (hard/AI) generates near-zero results due to large lower bound for num2 | services/gameLogic.ts | num2 lower bound changed to 1 |
| 4 | Missing "random" i18n translation key causes raw key shown in Stats screen | public/locales/en.json, de.json | Added "random" key to both locale files |
| 5 | AI mode multiplier already at 1.5× on question 1 (off-by-one in tier check) | App.tsx | Changed >= to > in tier comparison |
| 6 | Blank UI if locale JSON files fail to load | context/LocalizationContext.tsx | Added FALLBACK_TRANSLATIONS as initial state |
| 7 | Correct answer tick icon visible for <200ms — animate-fade-in completes just before state clears | App.tsx | Correct answer delay increased from 500ms to 1500ms |

## Open Bugs

None currently known.

## Monitoring / Notes

- Leaderboard stored in localStorage key `mathWhizLeaderboard` — if the schema changes, old entries may cause display issues. No migration logic exists.
- useSounds: AudioContext is created on first user interaction. If unlockAudio() is never called, all sounds silently no-op.
- Spaced repetition pool (weakQuestions) is reset on game reset — not persisted across sessions. Future enhancement: persist to localStorage.
