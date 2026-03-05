-- Vocara Initial Database Schema
-- Run this migration in your Supabase project via the SQL editor or CLI.

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  native_language TEXT DEFAULT 'en',
  target_language TEXT DEFAULT 'es',
  subscription_tier TEXT DEFAULT 'free',
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phrase TEXT,
  translation TEXT NOT NULL,
  context_sentence TEXT,
  source_url TEXT,
  source_title TEXT,
  screenshot_url TEXT,
  audio_url TEXT,
  part_of_speech TEXT,
  difficulty INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  ease_factor FLOAT DEFAULT 2.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.watch_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_url TEXT,
  language TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  words_looked_up INTEGER DEFAULT 0,
  words_saved INTEGER DEFAULT 0,
  comprehension_rating INTEGER,
  watched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.scene_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  screenshot_url TEXT,
  audio_clip_url TEXT,
  subtitle_original TEXT,
  subtitle_translation TEXT,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can manage own vocabulary" ON public.vocabulary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.watch_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own scene cards" ON public.scene_cards FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_vocabulary_user_id ON public.vocabulary(user_id);
CREATE INDEX idx_vocabulary_next_review ON public.vocabulary(user_id, next_review_at);
CREATE INDEX idx_watch_sessions_user_id ON public.watch_sessions(user_id);
CREATE INDEX idx_scene_cards_user_id ON public.scene_cards(user_id);
