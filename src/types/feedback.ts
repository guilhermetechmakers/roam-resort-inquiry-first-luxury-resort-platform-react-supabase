export interface FeedbackLog {
  id: string;
  source_url: string;
  page_title: string;
  message: string;
  sentiment: string;
  category: string;
  created_at: string;
  user_id?: string | null;
  session_id?: string | null;
}

/** Input accepts source_url or page_url, message or text */
export interface CreateFeedbackInput {
  source_url?: string;
  page_url?: string;
  page_title: string;
  message?: string;
  text?: string;
  sentiment?: string;
  category?: string;
  /** feedback_type alias for category */
  feedback_type?: string;
  user_id?: string | null;
  session_id?: string | null;
}

/**
 * Ready-to-ingest feedback item for analytics backend.
 * Use toAnalyticsFeedbackItem() to convert FeedbackLog to this format.
 */
export interface AnalyticsFeedbackItem {
  feedback_id: string;
  page_url: string;
  page_title: string;
  feedback_text: string;
  sentiment: string;
  feedback_type: string;
  timestamp: string;
  user_id?: string;
  session_id?: string;
}

export interface LogFeedbackResponse {
  success: boolean;
  feedback_id?: string;
  /** Full log entry for ingestion when successful */
  log_entry?: FeedbackLog;
  /** Ready-to-ingest feedback item for analytics backend */
  analytics_item?: AnalyticsFeedbackItem;
  /** Generic acknowledgment for feedback widget: "Thank you for your feedback!" */
  acknowledgment?: string;
  error?: string;
}

/** Generic acknowledgment message for feedback widget */
export const FEEDBACK_ACKNOWLEDGMENT = 'Thank you for your feedback!';

/**
 * Pre-built payload for New Tab "Thank you." case (chrome://newtab/).
 * Pass to logFeedback() to persist as general positive feedback.
 */
export const NEW_TAB_THANK_YOU_FEEDBACK: CreateFeedbackInput = {
  source_url: 'chrome://newtab/',
  page_title: 'New Tab',
  message: 'Thank you.',
  sentiment: 'positive',
  category: 'general',
};

/**
 * Converts FeedbackLog to analytics-ready format for backend ingestion.
 */
export function toAnalyticsFeedbackItem(log: FeedbackLog): AnalyticsFeedbackItem {
  return {
    feedback_id: log.id,
    page_url: log.source_url,
    page_title: log.page_title,
    feedback_text: log.message,
    sentiment: log.sentiment,
    feedback_type: log.category,
    timestamp: log.created_at,
    ...(log.user_id && { user_id: log.user_id }),
    ...(log.session_id && { session_id: log.session_id }),
  };
}
