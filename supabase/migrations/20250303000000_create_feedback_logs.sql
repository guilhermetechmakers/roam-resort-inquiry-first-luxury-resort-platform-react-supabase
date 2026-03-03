-- Feedback logs table for internal feedback logging (non-actionable user messages)
-- Converts messages like "Thank you." into positive-feedback log entries

CREATE TABLE IF NOT EXISTS public.feedback_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  page_title TEXT NOT NULL,
  message TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'positive',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying by timestamp and sentiment
CREATE INDEX IF NOT EXISTS idx_feedback_logs_created_at ON public.feedback_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_logs_sentiment ON public.feedback_logs (sentiment);

-- Enable RLS
ALTER TABLE public.feedback_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert for feedback (e.g. from New Tab page, extensions)
-- Restrict read to authenticated users or service role for admin dashboards
CREATE POLICY "Allow insert for feedback" ON public.feedback_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read for authenticated" ON public.feedback_logs
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

COMMENT ON TABLE public.feedback_logs IS 'Internal feedback logging for non-actionable user messages (e.g. Thank you.)';
