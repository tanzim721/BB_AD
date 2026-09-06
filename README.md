# BD Bank AD(ICT) MCQ & CQ Organizer

A Next.js app to organize exam prep questions for the Bangladesh Bank AD(ICT) exam. Supports MCQ and CQ (creative questions), with AI-powered image extraction via Claude.

## Features

- **14 pre-loaded CS topics** from the BD Bank AD(ICT) syllabus
- **Add MCQs** manually with 4 options, correct answer, and explanation
- **Add CQs** with stem + 4 parts (knowledge / understanding / application / higher ability)
- **Upload images** — Claude AI extracts all questions from textbook pages, question papers, or screenshots
- **Bulk import** extracted questions with a checkbox selector
- **Persistent storage** via Supabase

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Open **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy your Project URL and anon key

### 3. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key
```

Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
4. Click **Deploy** — live in ~1 minute at `your-app.vercel.app`

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Home page with topic grid
│   ├── layout.tsx                # Root layout with sidebar
│   ├── globals.css               # Global styles
│   └── api/
│       └── extract/route.ts      # Claude AI extraction endpoint
│   └── topics/
│       └── [id]/page.tsx         # Topic detail page
├── components/
│   ├── Sidebar.tsx               # Left nav with all 14 topics
│   ├── MCQCard.tsx               # MCQ display card
│   ├── CQCard.tsx                # CQ display card
│   ├── AddMCQModal.tsx           # Add MCQ form modal
│   ├── AddCQModal.tsx            # Add CQ form modal
│   └── UploadModal.tsx           # Image upload + AI extraction modal
├── lib/
│   ├── topics.ts                 # All 14 topic definitions
│   ├── supabase.ts               # Supabase client
│   └── useQuestions.ts           # Custom hook for CRUD operations
└── types/
    └── index.ts                  # TypeScript types
```
