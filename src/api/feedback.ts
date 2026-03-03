import { supabase } from '@/lib/supabase';
import type { CreateFeedbackInput, FeedbackLog, LogFeedbackResponse } from '@/types/feedback';
import { z } from 'zod';

const createFeedbackSchema = z.object({
  source_url: z.string().min(1, 'source_url is required'),
  page_title: z.string().min(1, 'page_title is required'),
  message: z.string().min(1, 'message must be non-empty'),
  sentiment: z.string().optional().default('positive'),
  category: z.string().optional().default('general'),
});

/**
 * Converts a non-actionable user message into an internal feedback log entry.
 * Validates content is non-empty, persists to Supabase, returns success + feedback_id.
 * No UI changes.
 */
export async function logFeedback(input: CreateFeedbackInput): Promise<LogFeedbackResponse> {
  const parsed = createFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join('; '),
    };
  }

  const { source_url, page_title, message, sentiment, category } = parsed.data;

  const { data, error } = await supabase
    .from('feedback_logs')
    .insert({
      source_url,
      page_title,
      message,
      sentiment,
      category,
    })
    .select('id')
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    feedback_id: (data as { id: string })?.id,
  };
}

export const feedbackApi = {
  log: logFeedback,

  getAll: async (): Promise<FeedbackLog[]> => {
    const { data, error } = await supabase
      .from('feedback_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  getById: async (id: string): Promise<FeedbackLog | null> => {
    const { data, error } = await supabase
      .from('feedback_logs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
