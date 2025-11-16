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

## Deploying on Vercel

This repo is organized as a monorepo: the static web app lives in `cutiecare-web/` while the
serverless Gemini endpoints live in the root `api/` directory. To deploy both pieces together on
Vercel:

1. Keep the repo root as the Project root (do **not** point Vercel at the `cutiecare-web` folder).
2. Use the provided `vercel.json` so Vercel builds the Vite app from `cutiecare-web` and exposes the
	`/api` serverless functions.
3. Set the following environment variables in the Vercel dashboard:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `GEMINI_API_KEY`

Without the Gemini API key, the `/api/gemini-chat` and `/api/gemini-summarize` endpoints will return
errors and the chat window will display “Cutie had trouble responding…”.