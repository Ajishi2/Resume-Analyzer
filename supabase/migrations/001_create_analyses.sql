-- Create analyses table for resume analysis results
CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  resume_text TEXT NOT NULL,
  job_description TEXT,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
