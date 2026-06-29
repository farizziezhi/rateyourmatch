-- Fix numeric field overflow for rating_avg when overall_score is 10.00
-- NUMERIC(3,2) only supports up to 9.99. We increase it to NUMERIC(4,2) which supports up to 99.99.
ALTER TABLE public.matches ALTER COLUMN rating_avg TYPE NUMERIC(4,2);
