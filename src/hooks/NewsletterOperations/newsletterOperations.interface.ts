// Newsletter Operations interfaces for mutations

import { AlertProfiles, AlertRun } from '../Newsletter/newsletter.interface';

// Create Newsletter interfaces
export interface CreateNewsletterPayload {
  title: string;
  cron_spec: string;
  user_id: string;
  company_ids: string[];
  email: string;
  alert_id?: string;
}

export interface CreateNewsletterResponse {
  alert_id: string;
  user_id: string;
  cron_spec: string;
  email: string;
  company_ids: string[];
}

// Delete Newsletter interfaces
export interface DeleteNewsletterPayload {
  userID: string;
  newsletterID: string;
}

// Delete Company interfaces
export interface DeleteCompanyPayload {
  userID: string;
  companyID: string;
}

// Email Send interfaces
export interface EmailSendPayload {
  message: string;
  emails: string[];
}

// Submit Updated Data interfaces
export interface SubmitUpdatedDataPayload {
  alert_id: string;
  start_date: string;
  end_date: string;
  filtered_companies: string[];
  runs: AlertRun[];
}

// Generic API response wrapper for operations
export interface OperationResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error response interface
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// Success response interface for operations that don't return data
export interface SuccessResponse {
  success: boolean;
  message?: string;
}
