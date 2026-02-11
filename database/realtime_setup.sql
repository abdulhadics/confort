-- 1. CHECK EXISTING PUBLICATIONS
-- Run this to see what publications exist and what tables are in them.
-- The default one created by Supabase is usually named 'supabase_realtime'.
SELECT * FROM pg_publication;

-- To see which tables are already in 'supabase_realtime':
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- 2. ENABLE REALTIME (OPTION A: INSERT ONLY - Recommended for this Dashboard)
-- This limits the bandwidth and is sufficient since we only want to see NEW calls.
-- Note: 'supabase_realtime' is the default publication name.
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;

-- 3. ENABLE REALTIME (OPTION B: ALL EVENTS - Insert, Update, Delete)
-- Use this if you want the dashboard to update when a status changes (e.g. "New" -> "Qualified")
-- First, ensure the table is added (same as above), then check the replication identity (usually fine as default).
-- Setup Replica Identity to allow updates/deletes to be tracked properly (uses Primary Key).
ALTER TABLE public.calls REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime SET TABLE public.calls; -- Resets to include everything by default if added

-- 4. VERIFICATION QUERY
-- Run this after running Option A or B. 
-- It should show 'calls' in the list.
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'calls';
