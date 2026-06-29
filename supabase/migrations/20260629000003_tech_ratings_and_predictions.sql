-- Add technical rating averages to matches table
ALTER TABLE public.matches 
  ADD COLUMN IF NOT EXISTS referee_avg NUMERIC(4,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tactics_avg NUMERIC(4,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS var_avg NUMERIC(4,2) DEFAULT 0;

-- Create technical_ratings table
CREATE TABLE IF NOT EXISTS public.technical_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  referee_score SMALLINT CHECK (referee_score BETWEEN 1 AND 10),
  tactics_score SMALLINT CHECK (tactics_score BETWEEN 1 AND 10),
  var_score SMALLINT CHECK (var_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Enable RLS on technical_ratings
ALTER TABLE public.technical_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technical ratings are viewable by everyone" ON public.technical_ratings 
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert technical ratings" ON public.technical_ratings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own technical ratings" ON public.technical_ratings 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tech_ratings_match ON public.technical_ratings(match_id);

-- Create predictions table
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  home_score INTEGER NOT NULL CHECK (home_score >= 0),
  away_score INTEGER NOT NULL CHECK (away_score >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Enable RLS on predictions
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Predictions are viewable by everyone" ON public.predictions 
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert predictions" ON public.predictions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON public.predictions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_predictions_match ON public.predictions(match_id);

-- Trigger function for aggregating technical ratings on matches
CREATE OR REPLACE FUNCTION public.update_match_tech_aggregate()
RETURNS TRIGGER AS $$
DECLARE
  target_match_id INTEGER;
BEGIN
  target_match_id := COALESCE(NEW.match_id, OLD.match_id);
  
  UPDATE public.matches
  SET
    referee_avg = COALESCE((SELECT AVG(referee_score) FROM public.technical_ratings WHERE match_id = target_match_id), 0),
    tactics_avg = COALESCE((SELECT AVG(tactics_score) FROM public.technical_ratings WHERE match_id = target_match_id), 0),
    var_avg = COALESCE((SELECT AVG(var_score) FROM public.technical_ratings WHERE match_id = target_match_id), 0),
    updated_at = now()
  WHERE id = target_match_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_technical_aggregate
AFTER INSERT OR UPDATE OR DELETE ON public.technical_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_match_tech_aggregate();
