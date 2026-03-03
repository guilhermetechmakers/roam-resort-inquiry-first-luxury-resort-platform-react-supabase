import { useMutation } from '@tanstack/react-query';
import { feedbackApi } from '@/api/feedback';
import type { CreateFeedbackInput, LogFeedbackResponse } from '@/types/feedback';

export function useLogFeedback() {
  return useMutation<LogFeedbackResponse, Error, CreateFeedbackInput>({
    mutationFn: feedbackApi.log,
  });
}
