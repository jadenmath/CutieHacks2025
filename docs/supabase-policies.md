# Supabase policies required for CutieCare

The `mood_entries` table has Row Level Security enabled. Supabase blocks all INSERT/SELECT
requests unless you explicitly allow authenticated users to access their own rows. When RLS is
left in its default state, the app will show errors like:

```
new row violates row-level security policy for table "mood_entries"
```

Run the SQL below in Supabase (SQL Editor or psql) to set the expected defaults and policies.

```sql
-- make sure RLS is enabled (Supabase does this by default, but it is harmless to repeat)
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- automatically stamp new rows with the authenticated user's id
ALTER TABLE public.mood_entries
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- authenticated users can read their own entries
CREATE POLICY "Select own mood entries"
ON public.mood_entries
FOR SELECT
USING ( auth.uid() = user_id );

-- authenticated users can insert rows for themselves
CREATE POLICY "Insert own mood entries"
ON public.mood_entries
FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- (optional) allow updates/deletes if you plan to add those features later
-- CREATE POLICY "Update own mood entries"
-- ON public.mood_entries
-- FOR UPDATE
-- USING ( auth.uid() = user_id )
-- WITH CHECK ( auth.uid() = user_id );

-- CREATE POLICY "Delete own mood entries"
-- ON public.mood_entries
-- FOR DELETE
-- USING ( auth.uid() = user_id );
```

After you run the statements:

1. Click **Run** in the SQL editor.
2. Re-authenticate in the app (log out/in) to ensure Supabase issues a fresh session.
3. Try another mood check-in. The insert should now succeed, and the Dashboard + Companion will
   reflect the new entry.

> Tip: If you only want authenticated users to write but everyone to read, add broader SELECT policies accordingly. For CutieCare we keep everything private per user.
