# Supabase Setup for Resume Analyzer

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in/up with GitHub
4. Create a new project
5. Choose a database password and region
6. Wait for the project to be ready

## 2. Get Connection Details

From your Supabase project dashboard:

1. Go to Settings → Database
2. Copy the **Connection string** under "Connection parameters"
3. Go to Settings → API  
4. Copy the **Project URL** and **anon public** key
5. Go to Settings → API → service_role (hidden) to get the service role key

## 3. Update .env File

Replace the placeholders in `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

# Supabase Configuration  
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the migration from `supabase/migrations/001_create_analyses.sql`

## 5. Start the Application

```bash
npm run dev
```

## 6. Test the Connection

The application should now connect to your Supabase PostgreSQL database and store resume analysis results.
