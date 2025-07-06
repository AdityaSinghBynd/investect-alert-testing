// Newsletter/Alert related interfaces based on actual API responses

export interface AlertProfiles {
  twitter?: string | null;
  website?: string | null;
  linkedin?: string | null;
  wikipedia?: string | null;
}

export interface Alert {
  alert_id: string;
  user_id: string;
  cron_spec: string;
  metadata?: any;
  created_at: string;
  deleted_at?: string | null;
  email: string;
  title?: string | null;
}

export interface Company {
  companyId: string;
  name: string;
  sector: string;
  profiles: AlertProfiles;
  logo?: string | null;
  createdAt: string;
  deletedAt: string;
}

export interface AlertSpecificData {
  query: string;
  intent: string;
  context: string;
}

export interface CompanyWithAlertData {
  company_id: string;
  name: string;
  sector: string;
  profiles: AlertProfiles;
  logo?: string | null;
  created_at: string;
  deleted_at: string;
  alert_specific_data: AlertSpecificData;
}

export interface NewsItem {
  title: string;
  sources: string[];
  keyPoints: string[];
}

export interface CompanyWithNews {
  id: string;
  name: string;
  sector: string;
  profiles: AlertProfiles;
  logo?: string | null;
  news: NewsItem[];
}

export interface AlertRun {
  run_id: string;
  date: string;
  timestamp: string;
  companies: CompanyWithNews[];
}

// API Response interfaces
export interface FetchAllNewslettersResponse {
  userId: string;
  count: number;
  alerts: Alert[];
}

export interface FetchAllCompaniesResponse {
  count: number;
  companies: Company[];
}

export interface FetchSingleNewsletterDataResponse {
  alert: Alert;
  companies: CompanyWithAlertData[];
  companies_count: number;
}

export interface FetchReceivedAlertsResponse {
  alert_id: string;
  start_date: string;
  end_date: string;
  runs: AlertRun[];
}

export interface FetchReceivedAlertsByCompanyIDResponse {
  alert_id: string;
  start_date: string;
  end_date: string;
  filtered_companies: string[];
  runs: AlertRun[];
}

// Payload interfaces
export interface FetchReceivedAlertsByDatePayload {
  user_id: string;
  alert_id: string;
  start_date: string;
  end_date: string;
}

export interface FetchReceivedAlertsByCompanyIDPayload {
  user_id: string;
  alert_id: string;
  start_date: string;
  end_date: string;
  company_ids: string[];
}

// Legacy interfaces for backward compatibility (if needed)
export interface Newsletter extends Alert {
  // Mapping for backward compatibility
  id: string; // maps to alert_id
  title: string; // maps to title (but handle null case)
  description: string; // can be derived from metadata or empty string
  frequency: string; // maps to cron_spec
  isActive: boolean; // derived from deleted_at being null
  createdAt: string; // maps to created_at
  updatedAt: string; // maps to created_at (or can be separate field)
  userId: string; // maps to user_id
  companyId?: string;
  categories?: string[];
}

export interface NewsletterDetails extends Newsletter {
  content: string;
  recipients: string[];
  deliveryStatus: string;
  lastDeliveredAt?: string;
  metrics?: {
    opens: number;
    clicks: number;
    bounces: number;
  };
}

// Utility type for API response wrapper
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
} 