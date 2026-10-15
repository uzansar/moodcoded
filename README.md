# Moodcoded 🌙

A responsive mood tracking and journaling web application built with React 19, Vite, styled-components, and Supabase.

---

## Features

- **Interactive Mood Calendar**: Visualise your daily moods with a soft pastel-to-vibrant color coding scheme.
- **Detailed Journaling**: Slider rating (1–10) with text notes for each day.
- **Insights & Stats**: Track monthly averages, best days, lowest days, consecutive streaks (>=5), and weekly trends powered by Recharts.
- **Dark Mode**: Complete theme toggle with system preference fallback and localStorage persistence.
- **Real-Time Cloud Sync**: Authentication and persistent storage with Supabase Postgres and Realtime subscriptions.
- **Data Protection**: Client and database-level validation preventing future-dated entries and protecting private journals.

---

## Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vite.dev/), [React Router 7](https://reactrouter.com/)
- **Styling**: [styled-components](https://styled-components.com/)
- **Visualisations**: [Recharts](https://recharts.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Realtime)

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Supabase](https://supabase.com/) project

### 2. Environment Setup

Create a `.env.local` file based on [.env.example](.env.example):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor. This sets up:
- `profiles` and `moods` tables
- Strict Row Level Security (RLS) policies
- Automatic profile creation trigger on signup
- Supabase Realtime replication on the `moods` table

### 4. Installation & Running

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run linter
npm run lint

# Production build
npm run build
```

---

## Project Structure

```
moodcoded/
├── public/                 # Static assets & SVG icons
├── supabase/
│   └── schema.sql          # SQL migration script with RLS & triggers
├── src/
│   ├── components/         # Calendar, DayCard, Header, StatsPanel, ProtectedRoute
│   ├── context/            # AuthContext, ThemeContext, MoodContext (Centralised State)
│   ├── hooks/              # useMoodData
│   ├── pages/              # CalendarPage, DayDetailPage, LoginPage
│   ├── styles/             # Light & Dark themes
│   ├── utils/              # Date manipulation, mood calculations, Supabase client
│   ├── App.jsx             # Top-level routing and providers
│   └── main.jsx
├── .env.example            # Environment variables template
└── IMPROVEMENTS.md         # Architecture and improvement tracker
```
