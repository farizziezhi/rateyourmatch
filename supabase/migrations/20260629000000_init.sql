-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  country_code TEXT,       -- ISO 3166-1 alpha-2
  total_ratings INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE NOT NULL,   -- football-data.org ID
  name TEXT NOT NULL,
  code TEXT NOT NULL,                     -- e.g. 'WC'
  emblem_url TEXT,
  season_start DATE,
  season_end DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on competitions
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Competitions are viewable by everyone" ON public.competitions
  FOR SELECT USING (true);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  tla TEXT,                              -- 3-letter abbreviation
  crest_url TEXT,
  country_code TEXT,
  group_letter TEXT,                     -- e.g. 'A', 'B'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone" ON public.teams
  FOR SELECT USING (true);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE NOT NULL,
  competition_id INTEGER REFERENCES public.competitions(id) ON DELETE SET NULL,
  home_team_id INTEGER REFERENCES public.teams(id) ON DELETE SET NULL,
  away_team_id INTEGER REFERENCES public.teams(id) ON DELETE SET NULL,
  matchday INTEGER,
  stage TEXT NOT NULL,                   -- 'GROUP_STAGE', 'ROUND_OF_32', etc.
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  utc_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  home_score INTEGER,
  away_score INTEGER,
  winner TEXT,                           -- 'HOME_TEAM', 'AWAY_TEAM', 'DRAW'
  rating_avg NUMERIC(4,2) DEFAULT 0,    -- Denormalized aggregate
  rating_count INTEGER DEFAULT 0,        -- Denormalized count
  is_ratable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone" ON public.matches
  FOR SELECT USING (true);

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  overall_score SMALLINT NOT NULL CHECK (overall_score BETWEEN 1 AND 10),
  entertainment_score SMALLINT CHECK (entertainment_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Enable RLS on ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Auth users can insert ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON public.profiles(reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_teams_external ON public.teams(external_id);
CREATE INDEX IF NOT EXISTS idx_teams_group ON public.teams(group_letter);
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(utc_date);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON public.matches(stage);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_ratable ON public.matches(is_ratable) WHERE is_ratable = true;
CREATE INDEX IF NOT EXISTS idx_matches_rating ON public.matches(rating_avg DESC) WHERE rating_count > 0;
CREATE INDEX IF NOT EXISTS idx_ratings_match ON public.ratings(match_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_score ON public.ratings(match_id, overall_score);

-- Trigger function for rating updates
CREATE OR REPLACE FUNCTION public.update_match_rating_aggregate()
RETURNS TRIGGER AS $$
DECLARE
  target_match_id INTEGER;
BEGIN
  target_match_id := COALESCE(NEW.match_id, OLD.match_id);
  
  UPDATE public.matches
  SET
    rating_avg = COALESCE((SELECT AVG(overall_score) FROM public.ratings WHERE match_id = target_match_id), 0),
    rating_count = COALESCE((SELECT COUNT(*) FROM public.ratings WHERE match_id = target_match_id), 0),
    updated_at = now()
  WHERE id = target_match_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_rating_aggregate
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_match_rating_aggregate();

-- Trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
