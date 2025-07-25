# Supabase Integration for Notes Frontend (Angular)

This frontend uses Supabase as a backend for storing notes. To connect to Supabase, you must provide the project URL and the anonymous API key as environment variables.

## Required Environment Variables

Configure these variables in your build environment:

- `NG_APP_SUPABASE_URL` &mdash; The URL of your Supabase project.
- `NG_APP_SUPABASE_KEY` &mdash; The anonymous public API key.

## Usage

These environment variables are used to instantiate the Supabase client in `notes.service.ts`:

```typescript
const supabaseUrl = (window as any)["env"]?.NG_APP_SUPABASE_URL || (import.meta as any).env?.NG_APP_SUPABASE_URL;
const supabaseKey = (window as any)["env"]?.NG_APP_SUPABASE_KEY || (import.meta as any).env?.NG_APP_SUPABASE_KEY;
this.supabase = createClient(supabaseUrl, supabaseKey);
```

## Database Table

Supabase must include a table named `notes` with the following columns (types are recommended):

- `id`: integer, primary key, auto-increment
- `title`: text
- `content`: text
- `created_at`: timestamp, default now()
- `updated_at`: timestamp, updated on change

## CRUD Features

This app allows you to:
- Create new notes
- Edit existing notes
- View all notes
- Delete notes

All operations are handled through the Supabase JS SDK.
