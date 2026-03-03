-- =====================================================
-- Migration: Add optional user_id and session_id to feedback_logs
-- Created: 2025-03-03T12:00:00.000Z
-- Purpose: Support user/session identifiers for analytics when available
-- =====================================================

-- Add optional user_id (references auth.users when user is authenticated)
ALTER TABLE public.feedback_logs
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add optional session_id for anonymous session tracking
ALTER TABLE public.feedback_logs
  ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_feedback_logs_user_id ON public.feedback_logs (user_id) WHERE user_id IS NOT NULL;

COMMENT ON COLUMN public.feedback_logs.user_id IS 'Authenticated user ID when available; null for anonymous feedback';
COMMENT ON COLUMN public.feedback_logs.session_id IS 'Session identifier when available for anonymous analytics';
