-- User Activity Tracking Schema
-- Run this in your Supabase SQL editor

-- 1. Add profile picture and additional fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Create user_activity table to track practice sessions
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_content_id UUID REFERENCES practice_content(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('started', 'completed', 'abandoned')),
  score INTEGER,
  total_questions INTEGER,
  correct_answers INTEGER,
  time_spent_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create user_stats table for aggregated statistics
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_practice_sessions INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  total_time_spent_seconds INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_practice_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add RLS policies for user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_activity_select_policy ON user_activity;
CREATE POLICY user_activity_select_policy ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_activity_insert_policy ON user_activity;
CREATE POLICY user_activity_insert_policy ON user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_activity_update_policy ON user_activity;
CREATE POLICY user_activity_update_policy ON user_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Add RLS policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_achievements_select_policy ON user_achievements;
CREATE POLICY user_achievements_select_policy ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_achievements_insert_policy ON user_achievements;
CREATE POLICY user_achievements_insert_policy ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Add RLS policies for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_stats_select_policy ON user_stats;
CREATE POLICY user_stats_select_policy ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_stats_insert_policy ON user_stats;
CREATE POLICY user_stats_insert_policy ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_stats_update_policy ON user_stats;
CREATE POLICY user_stats_update_policy ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- 8. Create function to update user stats when activity is recorded
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user_stats
  INSERT INTO user_stats (user_id, total_practice_sessions, total_questions_answered, total_correct_answers, total_time_spent_seconds, last_practice_date, updated_at)
  VALUES (
    NEW.user_id,
    1,
    COALESCE(NEW.total_questions, 0),
    COALESCE(NEW.correct_answers, 0),
    COALESCE(NEW.time_spent_seconds, 0),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_practice_sessions = user_stats.total_practice_sessions + 1,
    total_questions_answered = user_stats.total_questions_answered + COALESCE(NEW.total_questions, 0),
    total_correct_answers = user_stats.total_correct_answers + COALESCE(NEW.correct_answers, 0),
    total_time_spent_seconds = user_stats.total_time_spent_seconds + COALESCE(NEW.time_spent_seconds, 0),
    last_practice_date = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for user_activity
DROP TRIGGER IF EXISTS trigger_update_user_stats ON user_activity;
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON user_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- 10. Add some sample achievements
INSERT INTO user_achievements (user_id, achievement_type, title, description, icon_name)
SELECT 
  p.id,
  'first_practice',
  'First Steps',
  'Completed your first practice session',
  'BookOpen'
FROM profiles p
WHERE p.id IN (SELECT id FROM auth.users LIMIT 1)
ON CONFLICT DO NOTHING;
