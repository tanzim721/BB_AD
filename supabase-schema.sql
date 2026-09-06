-- Run this in Supabase SQL Editor: supabase.com → your project → SQL Editor

create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  topic_id    int  not null,
  type        text not null check (type in ('mcq', 'cq')),

  -- MCQ fields
  question    text,
  option_a    text,
  option_b    text,
  option_c    text,
  option_d    text,
  correct_answer char(1) check (correct_answer in ('a','b','c','d')),
  explanation text,

  -- CQ fields
  stem        text,
  parts       jsonb,   -- [{ question: string, answer: string }]

  -- Common fields
  subtopic    text,
  created_at  timestamptz default now()
);

-- Index for fast topic lookups
create index if not exists questions_topic_idx on questions (topic_id);

-- Enable Row Level Security (optional but recommended)
alter table questions enable row level security;

-- Allow all operations for now (tighten later with auth)
create policy "Allow all" on questions for all using (true) with check (true);
