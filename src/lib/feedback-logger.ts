/**
 * Converts non-actionable user messages (e.g. "Thank you.") into internal feedback log entries.
 * Use this when the user provides positive feedback with no bug, feature request, or styling issue.
 *
 * Example: New Tab page (chrome://newtab/) - user says "Thank you."
 * → Creates log: source_url, page_title, message, sentiment='positive', category='general'
 *
 * Steps: 1) validate content non-empty; 2) persist the log entry; 3) return success + feedback_id
 * No UI changes.
 */
export { logFeedback } from '@/api/feedback';
