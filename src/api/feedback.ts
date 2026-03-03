import { supabase } from '@/lib/supabase';
import type { CreateFeedbackInput, FeedbackLog, LogFeedbackResponse } from '@/types/feedback';
import { FEEDBACK_ACKNOWLEDGMENT } from '@/types/feedback';
import { z } from 'zod';

const createFeedbackSchema = z
  .object({
    source_url: z.string().optional(),
    page_url: z.string().optional(),
    page_title: z.string().min(1, 'page_title is required'),
    message: z.string().optional(),
    text: z.string().optional(),
    sentiment: z.string().optional().default('positive'),
    category: z.string().optional().default('general'),
  })
  .refine(
    (d) => (d.source_url ?? d.page_url ?? '').length > 0,
    { message: 'source_url or page_url is required', path: ['source_url'] }
  )
  .refine(
    (d) => (d.message ?? d.text ?? '').trim().length > 0,
    { message: 'message or text must be non-empty', path: ['message'] }
  )
  .transform((d) => ({
    source_url: (d.source_url ?? d.page_url ?? '').trim(),
    page_title: d.page_title.trim(),
    message: (d.message ?? d.text ?? '').trim(),
    sentiment: d.sentiment ?? 'positive',
    category: d.category ?? 'general',
  }));

/**
 * Converts a non-actionable user message into an internal feedback log entry.
 * Validates content is non-empty, persists to Supabase, returns success + feedback_id + log_entry.
 * No UI changes. Use acknowledgment for feedback widget display.
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
    .select('*')
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const logEntry = data as FeedbackLog;
  return {
    success: true,
    feedback_id: logEntry.id,
    log_entry: logEntry,
    acknowledgment: FEEDBACK_ACKNOWLEDGMENT,
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
