export interface FeedbackLog {
  id: string;
  source_url: string;
  page_title: string;
  message: string;
  sentiment: string;
  category: string;
  created_at: string;
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
}

export interface LogFeedbackResponse {
  success: boolean;
  feedback_id?: string;
  /** Full log entry for ingestion when successful */
  log_entry?: FeedbackLog;
  /** Generic acknowledgment for feedback widget: "Thank you for your feedback!" */
  acknowledgment?: string;
  error?: string;
}

/** Generic acknowledgment message for feedback widget */
export const FEEDBACK_ACKNOWLEDGMENT = 'Thank you for your feedback!';
