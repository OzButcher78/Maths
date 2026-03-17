# Mathe-Meister — Improvement Plan

Generated from: QA audit, teacher pedagogical review, and child engagement review.

**Legend:** ✅ Done | 🔲 Not yet implemented

---

## Part 1: Bugs

### Critical — Broken Gameplay

✅ **1. Streak resets at 20 and never continues**
- Fixed: Removed the reset condition. Streak now increments freely past 20.

✅ **2. Wrong answers penalised with difficulty multiplier**
- Fixed: Wrong answers always deduct flat −2 regardless of difficulty.

✅ **3. Subtraction generates trivially easy results on hard/AI**
- Fixed: `num2` lower bound set to `1` instead of `r.sub[0]`.

### High — UX / Localisation

✅ **4. Missing "random" translation key**
- Fixed: Added `"random": "Mixed Operations"` / `"Gemischte Rechenarten"` to both locale files.

✅ **5. AI mode multiplier starts at 1.5× on question 1**
- Fixed: Changed `>= tier` to `> tier` in tier comparison.

✅ **6. Locale fetch can silently fail with blank UI**
- Fixed: Added `FALLBACK_TRANSLATIONS` as initial state in `LocalizationContext.tsx`.

---

## Part 2: Pedagogical Improvements (Teacher Perspective)

### High Priority

🔲 **7. Show working on wrong answers, not just the correct answer**
- Add a 3–4 second "explain" card showing one line of working (e.g. "7 + 5 = 7 + 3 + 2 = 12").

🔲 **8. Add a Practice Mode (no lives, no penalty, hints allowed)**
- Distinguish formative practice from scored challenge. Practice Mode: unlimited attempts, hints, no leaderboard.

✅ **9. AI mode tracks accuracy, not just question count**
- Done: `aiTierProgress` state in App.tsx. Advances tier at ≥85% accuracy after 5 questions; retreats below 60%.

✅ **10. Difficulty age labels added to menu**
- Done: Difficulty buttons now show `Easy (5-7)`, `Medium (7-9)`, `Hard (9-11)`, `AI ★`.
- Note: Full curriculum-aligned number range restructuring (bridging 10, teen numbers) not yet done.

🔲 **11. Reduce/remove time pressure for ages 6–8**
- Restrict Time Attack to Medium/Hard. Offer unlimited-time "Calm Mode" for younger children.

✅ **12. Track accuracy per number range**
- Done: Stats screen shows per-range breakdown: 1–10, 11–20, 21–50, 51–100, 101+.

✅ **13. Streak bonuses reduced to discourage guessing**
- Done: Bonuses reduced to 3:+1, 6:+2, 10:+4, 15:+6, 20:+10.

✅ **14. Spaced repetition for missed questions**
- Done: Wrong answers added to `weakQuestions[]` pool (max 10). 30% chance of re-serving each question.

### Medium Priority

🔲 **15. Add optional hint system**
- A "?" button shows a strategy hint (not the answer): "Try: count up from the smaller number."

✅ **16. Extend wrong-answer pause to 3–4 seconds**
- Done: Delay extended from 2s to 3s.

🔲 **17. Add long-term progress tracking for parents/teachers**
- Store a daily snapshot in localStorage. Add a "Progress" view with 7-day accuracy chart.

✅ **18. Add curriculum year-level labels**
- Done: Age guidance shown on difficulty buttons (see #10 above).

---

## Part 3: Fun & Engagement Improvements (Child Perspective)

### Quick Wins — High Impact, Low Effort

✅ **19. Particle/confetti effects on correct answers**
- Done: `ConfettiEffect.tsx` — 16 coloured dots burst outward on each correct answer.

✅ **20. Floating score pop-ups**
- Done: `FloatingScore.tsx` — "+N" floats up and fades; green for normal, gold for bonuses.

✅ **21. Streak fire indicator (Duolingo-style)**
- Done: `StreakIndicator.tsx` rewritten — 🔥 emoji grows from `text-2xl` to 🔥🔥 `text-5xl` with glow/bounce at high streaks.
- Note: All-time best streak persistence to localStorage not yet done.

🔲 **22. Faster "Play Again" on Game Over**
- Add a one-tap "Play Again (same settings)" button without re-navigating the menu.

✅ **23. Timer bar with colour urgency**
- Done: Colour-shifting progress bar below stats row (green → yellow → pulsing red).

✅ **24. Mute / settings toggle on menu**
- Done: 🔊/🔇 button on menu screen. Controlled via `isMuted` state in `useSounds.ts`.

### Medium Effort — Significant Engagement Boost

🔲 **25. Achievement / badge system**
- Persistent badges stored in localStorage: "First 10-streak", "Speed Demon", "100 Points", "Accuracy Expert".
- Show on Game Over screen and a dedicated Achievements tab.

🔲 **26. Daily challenge**
- One preset challenge per day. Rewards a unique badge. Resets at midnight.

🔲 **27. Progressive difficulty unlock**
- New players start with Easy only. Medium unlocks at 50pts, Hard at 100pts on Medium.

🔲 **28. Theme/cosmetic unlocks**
- Unlock "Space" or "Candy" backgrounds at score milestones (swap Tailwind gradient class).

✅ **29. Avatar/mascot character**
- Done: Wizard sprite (Game Character Sprites #08, 36 PNG frames). Appears in wrong-answer overlay (dizzy), streak/progress splash (attack2), and Game Over screen (die / attack2 / idle based on reason).

🔲 **30. Onboarding tutorial for first-time players**
- Three-slide intro (keypad → streaks → leaderboard). Shown once, skippable.

### Long-term — Keeps Kids Coming Back

🔲 **31. XP and level system**
- Points contribute to an XP bar and player level ("Math Apprentice" → "Math Master").

🔲 **32. Weekly leaderboard**
- Separate leaderboard that resets weekly. Gives newer players a chance to appear near the top.

🔲 **33. "Challenge a friend" via score code**
- Game Over screen generates a short code. A friend can enter it to attempt the same challenge.

🔲 **34. Multiple game modes**
- **Perfect Mode**: one wrong answer ends the game.
- **Endless Mode**: no lives, no timer — how many correct in a row?
- **Target Score Mode**: reach exactly X points before time runs out.

---

## Implementation Progress

| Phase | Items | Status |
|---|---|---|
| **1 — Bug fixes** | #1–6 | ✅ All done |
| **2 — Quick UX wins** | #19–24 | ✅ #19, 20, 21, 23, 24 done — 🔲 #22 remaining |
| **3 — Pedagogy essentials** | #7, #8, #9, #10, #11, #12, #13, #14, #16, #18 | ✅ #9, 10, 12, 13, 14, 16, 18 done — 🔲 #7, 8, 11 remaining |
| **4 — Engagement features** | #25–30 | ✅ #29 done — 🔲 #25, 26, 27, 28, 30 remaining |
| **5 — Deeper learning** | #15, #17 | 🔲 None yet |
| **6 — Long-term retention** | #31–34 | 🔲 None yet |
