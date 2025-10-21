-- Temporarily disable RLS for testing without authentication
-- IMPORTANT: Only use this during development!
-- Re-enable RLS when you add authentication.

ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE context_embeddings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('conversations', 'messages', 'context_embeddings');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Row Level Security has been DISABLED for testing.';
  RAISE NOTICE 'Remember to re-enable it when adding authentication!';
END $$;
