# CutieHacks2025

## Supabase setup

The web app expects the `mood_entries` table to have Row Level Security policies that let each
authenticated user read/write only their own moods. If you see errors like

```
new row violates row-level security policy for table "mood_entries"
```

follow the SQL snippets inside [`docs/supabase-policies.md`](docs/supabase-policies.md) to create
the required policies. Once they are in place, log out/in and check-ins will start saving
successfully.