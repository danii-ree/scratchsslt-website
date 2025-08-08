-- Update database schema for new upload modal structure
-- This script adds support for text-based passages and optional images

-- 1. Add image_url column to practice_content table
ALTER TABLE practice_content 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Make document_id nullable (since we're not using documents for text content)
-- Note: This is already nullable in the schema, but ensuring it's properly set

-- 3. Update RLS policies to allow image_url access
DROP POLICY IF EXISTS practice_content_select_policy ON practice_content;
CREATE POLICY practice_content_select_policy ON practice_content
    FOR SELECT USING (true);

DROP POLICY IF EXISTS practice_content_insert_policy ON practice_content;
CREATE POLICY practice_content_insert_policy ON practice_content
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS practice_content_update_policy ON practice_content;
CREATE POLICY practice_content_update_policy ON practice_content
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 4. Create storage bucket for passage images if it doesn't exist
-- Note: This will be handled by the application code, but you can also create it manually in Supabase dashboard

-- 5. Update storage policies for passage-images bucket
-- Run this in Supabase SQL editor after creating the bucket manually if needed
-- INSERT INTO storage.buckets (id, name, public) VALUES ('passage-images', 'passage-images', true);

-- 6. Create storage policy for passage-images
DROP POLICY IF EXISTS passage_images_select_policy ON storage.objects;
CREATE POLICY passage_images_select_policy ON storage.objects
    FOR SELECT USING (bucket_id = 'passage-images');

DROP POLICY IF EXISTS passage_images_insert_policy ON storage.objects;
CREATE POLICY passage_images_insert_policy ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'passage-images' AND auth.uid() IS NOT NULL);

-- 7. Ensure questions table has proper RLS policies
DROP POLICY IF EXISTS questions_select_policy ON questions;
CREATE POLICY questions_select_policy ON questions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS questions_insert_policy ON questions;
CREATE POLICY questions_insert_policy ON questions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8. Add some sample data to test the new structure
INSERT INTO practice_content (title, description, difficulty, time_estimate, question_type, image_url)
VALUES (
    'Sample Reading Passage',
    'This is a sample reading passage for testing the new upload system. It contains text that students can read and answer questions about.',
    'medium',
    '15 mins',
    'multiple-choice',
    NULL
) ON CONFLICT DO NOTHING;

-- 9. Add sample questions for the test content
INSERT INTO questions (practice_content_id, question_text, question_type, options, correct_answer)
SELECT 
    pc.id,
    'What is the main topic of this passage?',
    'multiple-choice',
    '["Reading comprehension", "Mathematics", "Science", "History"]'::jsonb,
    'Reading comprehension'
FROM practice_content pc 
WHERE pc.title = 'Sample Reading Passage'
ON CONFLICT DO NOTHING;
