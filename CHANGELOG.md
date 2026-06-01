# Changelog

## 2026-06-01

### Add x15 and x25 times tables
- Extended the multiplication table picker (`MultiplicationSetupScreen`) with the 15 and 25 tables, which kids are now learning in school.
- No question-generation changes needed — `generateQuestion` already multiplies any selected table by 1–12.

## 2026-05-23

### Fix: prevent multi-tap score exploit
- After a correct answer, kids could spam-tap ✓ during the 1500ms feedback delay and earn extra points each tap.
- `GameScreen.handleSubmit` and `App.handleAnswer` now both reject submissions while `answerFeedback !== null` — points only count once per question.

## 2026-03-18

### Wav sound effects for wizard
- Replaced synthesized sounds with wav files: `wrong.wav` (incorrect answer), `magic.wav` (splash/milestones), `defeat.wav` (game over), `powerup.wav` (future use).
- All wav files preloaded on `unlockAudio()` for instant playback.
- Streak milestones now play only `magic.wav` (removed duplicate sounds).

### Mobile layout optimizations
- Reduced vertical padding/gaps across App, GameScreen, and MenuScreen for better iPhone fit.
- Wrong answer overlay uses `fixed inset-2 rounded-2xl` on mobile to stay within viewport with rounded corners.
- Answer feedback icon (tick/cross) moved inline with streak indicator on mobile to save vertical space.

### Removed mute button
- Removed sound toggle from MenuScreen — users control volume via device settings.

### Wizard die animation fix
- Stopped die animation at frame 5 to avoid faded-out transparent frames on game over screen.
