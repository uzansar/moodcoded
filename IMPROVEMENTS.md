# Moodcoded – Improvement Plan & Implementation Tracker

This document tracks completed fixes and future roadmap enhancements for Moodcoded, prioritised by importance (correctness, data integrity, security, UX) and effort.

**Effort scale:** 🟢 Quick (< 30 min) · 🟡 Medium (1–3 h) · 🔴 Large (half a day or more)

---

## ✅ Completed Improvements

### 🔥 Priority 1: Critical Bug Fixes & Correctness
- [x] **1.1 Timezone fix for streaks and weekly trends** (`src/utils/moodUtils.js`)  
  Replaced UTC `toISOString().split('T')[0]` with local `formatDate()` to prevent streak resets and one-day offsets in BST (UTC+1).
- [x] **1.2 Accurate streak calculation** (`src/utils/moodUtils.js`)  
  Fixed `calculateBestStreak` to check consecutive calendar days with mood $\ge 5$ rather than sequential array entries.
- [x] **1.3 Asynchronous save/delete flow** (`src/pages/DayDetailPage.jsx`)  
  Made `handleSave` and `handleDelete` properly `await` backend responses with disabled button states and user-facing error banners.
- [x] **1.4 Character encoding fix** (`src/components/Calendar.jsx`, `src/pages/LoginPage.jsx`)  
  Replaced corrupted symbols with clean UTF-8 navigation arrows (`‹` / `›`) and proper emoji icons.
- [x] **1.5 Missing environment variable guard** (`src/utils/supabaseClient.js`)  
  Added checks and descriptive console warnings for missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [x] **1.6 Numeric rating enforcement** (`src/pages/DayDetailPage.jsx`)  
  Explicitly parsed rating slider inputs with `Number(e.target.value)`.
- [x] **1.7 Future date logging prevention** (`src/components/Calendar.jsx`, `src/components/DayCard.jsx`, `src/pages/DayDetailPage.jsx`)  
  Disabled future days in the calendar with dimmed opacity and blocked logging on the detail page.
- [x] **1.8 Distinct signup feedback** (`src/pages/LoginPage.jsx`)  
  Separated account creation success message with green feedback banner rather than routing through the error box.

### ⚠️ Priority 2: Architecture & Security
- [x] **2.1 Centralised state management** (`src/context/MoodContext.jsx`, `src/App.jsx`)  
  Implemented `MoodProvider` to prevent duplicated fetches and realtime subscription leaks across components.
- [x] **2.2 Loading race condition fix** (`src/pages/DayDetailPage.jsx`)  
  Decomposed detail form into `MoodForm` to eliminate cascading `setState` calls in effects and prevent overwriting user input on slow network loads.
- [x] **2.3 Row Level Security (RLS)** (`supabase/schema.sql`)  
  Created complete Postgres migration script with strict user isolation policies for `moods` and `profiles`.
- [x] **2.4 Automated profile creation trigger** (`supabase/schema.sql`)  
  Configured PostgreSQL trigger `on_auth_user_created` to create user profiles automatically on signup.
- [x] **2.5 Styled-components transient props** (`src/components/DayCard.jsx`, `src/pages/DayDetailPage.jsx`)  
  Prefixed custom props with `$` (`$backgroundColor`, `$moodColor`, `$isDark`, `$isToday`, `$isFuture`) to eliminate unknown DOM attribute console warnings.
- [x] **2.6 Dark mode styling on Day Detail** (`src/pages/DayDetailPage.jsx`)  
  Adjusted slider gradients and rating text colors to respond to dark mode.

### 🧹 Priority 3: Developer Experience & Code Quality
- [x] **3.1 Comprehensive documentation** (`README.md`)  
  Replaced default template README with full feature guide, setup instructions, architecture breakdown, and database details.
- [x] **3.2 Environment configuration template** (`.env.example`)  
  Added clear template file for Supabase keys.
- [x] **3.3 Lint and warning cleanup** (`eslint.config.js`, `src/pages/DayDetailPage.jsx`)  
  Removed unused imports and fixed all ESLint errors.
- [x] **3.4 Disambiguated duplicate function name** (`src/utils/moodUtils.js`, `src/components/StatsPanel.jsx`)  
  Renamed mood counting function to `countMoodsInMonth` while preserving a backwards-compatible alias.

### ♿ Priority 4: Accessibility & Navigation
- [x] **4.1 Keyboard accessible calendar cells** (`src/components/DayCard.jsx`)  
  Added `role="button"`, `tabIndex={0}`, `Enter`/`Space` key handlers, and descriptive `aria-label` tags.
- [x] **4.2 "Today" navigation & highlight** (`src/components/Calendar.jsx`, `src/components/DayCard.jsx`)  
  Added a quick "Today" shortcut button in the calendar header and highlighted today's tile with an accent border and badge.

### 🎨 Priority 5: UX-First Modern Frontend Overhaul
- [x] **5.0 Authentic Mood Journal Design & UX Architecture**
  - **Restorative graphite & indigo palette** (`#111215` background, `#18191E` cards, subtle borders `#262830`, calming indigo accents, and organic 1–10 emotional gradient).
  - **Authentic Moodcoded brand emblem**: bespoke reflection wave emblem replaced foreign video/play metaphors.
  - **Tactile 1–10 Stepped Mood Selector** (`src/components/MoodModal.jsx`): interactive numbered stepper buttons with human status labels (*Struggling*, *Steady*, *Thriving*) and quick `#Grateful`, `#Calm`, `#Anxious` sentiment tags.
  - **Collapsible Sidebar & Navigation** (`src/components/Sidebar.jsx`): calm icons and a dedicated streak counter widget (*Calendar*, *Insights*, *Timeline*).
  - **Clean Header Navigation** (`src/components/Header.jsx`): top search box with instant note searching, "+ Log Mood" button, theme toggle, and user initials avatar.
  - **DayCard visual aura** (`src/components/DayCard.jsx`): ambient colored accent indicators, clean date numbers, and note snippet previews.
  - **Refined Area Curve Analytics** (`src/components/StatsPanel.jsx`): replaced harsh lines with soft gradient area curves and human summary metrics.
  - **Private Journal Auth Card** (`src/pages/LoginPage.jsx`): welcoming, privacy-focused sign-in card.

---

## 📌 Remaining Backlog

### 🧹 Code Quality & Testing (Priority 3)
| # | Task | Effort | Description |
|---|------|--------|-------------|
| 3.5 | **Unit tests (Vitest)** | 🟡 | Add tests for `moodUtils.js` (streaks, averages, edge cases) and `dateUtils.js`. |
| 3.6 | **404 Route & Error Boundary** | 🟢 | Add catch-all route for invalid URLs and a React error boundary fallback. |
| 3.7 | **Prettier & Pre-commit Hook** | 🟢 | Standardise formatting across team members with Husky + lint-staged. |
| 3.8 | **TypeScript Migration** | 🔴 | Type definitions for Moods, Themes, and Auth payloads. |

### ♿ UX & Polish (Priority 4)
| # | Task | Effort | Description |
|---|------|--------|-------------|
| 4.3 | **Modals & Toast Notifications** | 🟡 | Replace native browser `confirm()` with custom dialog and add floating toast notices for save/delete actions. |
| 4.4 | **Skeletons & Empty States** | 🟡 | Friendly empty state graphic for new users with no logs yet. |
| 4.5 | **Unsaved Changes Warning** | 🟢 | Prompt user before navigating away if entry text was edited. |
| 4.6 | **Entry Character Counter / Auto-save** | 🟡 | Display character count and store drafts in `localStorage`. |
| 4.7 | **WCAG Contrast Audit** | 🟡 | Verify contrast on pastel rating labels in both light and dark themes. |

### ✨ Future Features (Priority 5)
| # | Feature | Effort | Description |
|---|---------|--------|-------------|
| 5.1 | **Data Export / Import** | 🟡 | Export journals as CSV / JSON and allow backup restoration. |
| 5.2 | **Mood Tags & Activities** | 🔴 | Tag days with categories (e.g. Work, Exercise, Sleep) with correlation insights. |
| 5.3 | **Year-in-Pixels Heatmap** | 🟡 | Annual overview grid showing full year mood palette. |
| 5.4 | **Search & Filters** | 🟡 | Text search through journal notes and filter by rating range. |
| 5.5 | **PWA & Offline Mode** | 🔴 | Installable Progressive Web App with offline service worker. |
| 5.6 | **Account Management & Real Emails** | 🔴 | Password reset, delete account, and optional social/OAuth login. |
| 5.7 | **Route Code Splitting** | 🟢 | Lazy-load Recharts and route pages with `React.lazy`. |
| 5.8 | **CI/CD Workflows** | 🟡 | GitHub Actions workflow for lint, test, and automated deployment. |
