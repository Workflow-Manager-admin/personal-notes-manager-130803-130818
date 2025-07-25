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

- `id`: integer, primary key, auto-increment (may appear as bigint)
- `title`: text
- `content`: text
- `created_at`: timestamp, default now()
- `updated_at`: timestamp, updated on change

Your Supabase table may include additional columns (e.g., `body`, `tags`, etc.), but at minimum, the above are required for this app to work.

## Row Level Security (RLS) & Policies

Row Level Security is ENABLED on the `notes` table.

The following open (demo) policies have been applied:
- **Allow all read**: Anyone can read notes.
- **Allow all insert**: Anyone can create notes.
- **Allow all update**: Anyone can update notes.
- **Allow all delete**: Anyone can delete notes.

> These policies are suitable for demonstration/development purposes. For production, restrict access as appropriate.

## CRUD Features

This app allows you to:
- Create new notes
- Edit existing notes
- View all notes
- Delete notes

All operations are handled through the Supabase JS SDK.

---

### Supabase Setup Instructions for Developers

1. Make sure your Supabase project environment exposes the following variables:
   - `NG_APP_SUPABASE_URL` (String)
   - `NG_APP_SUPABASE_KEY` (String)

2. Table structure:
   - Table name: `notes`
   - Columns: `id`, `title`, `content`, `created_at`, `updated_at` (extra columns permitted)

3. Row Level Security:
   - Make sure RLS is enabled on `notes`.
   - The following SQL should have already been applied:
     ```sql
     ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Allow all read" ON notes FOR SELECT USING (true);
     CREATE POLICY "Allow all insert" ON notes FOR INSERT WITH CHECK (true);
     CREATE POLICY "Allow all update" ON notes FOR UPDATE USING (true);
     CREATE POLICY "Allow all delete" ON notes FOR DELETE USING (true);
     ```

4. These settings allow the Angular app to perform CRUD operations on the notes table without authentication.

5. For production, restrict the policies as appropriate.

