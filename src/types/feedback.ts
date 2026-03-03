export interface FeedbackLog {
  id: string;
  source_url: string;
  page_title: string;
  message: string;
  sentiment: string;
  category: string;
  created_at: string;
}

export interface CreateFeedbackInput {
  source_url: string;
  page_title: string;
  message: string;
  sentiment?: string;
  category?: string;
}

export interface LogFeedbackResponse {
  success: boolean;
  feedback_id?: string;
  error?: string;
}
