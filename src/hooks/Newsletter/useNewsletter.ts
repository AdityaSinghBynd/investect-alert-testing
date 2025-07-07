import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { ApiService } from "@/services/service";
import { AxiosResponse } from "axios";
import {
  Alert,
  Company,
  FetchAllNewslettersResponse,
  FetchAllCompaniesResponse,
  FetchSingleNewsletterDataResponse,
  FetchReceivedAlertsResponse,
  FetchReceivedAlertsByDatePayload,
  FetchReceivedAlertsByCompanyIDPayload,
  FetchReceivedAlertsByCompanyIDResponse,
  Newsletter,
  NewsletterDetails,
  ApiResponse,
} from './newsletter.interface';

// Query Keys - centralized for better cache management
export const NEWSLETTER_QUERY_KEYS = {
  all: ['newsletters'] as const,
  lists: () => [...NEWSLETTER_QUERY_KEYS.all, 'list'] as const,
  list: (userId: string) => [...NEWSLETTER_QUERY_KEYS.lists(), userId] as const,
  details: () => [...NEWSLETTER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NEWSLETTER_QUERY_KEYS.details(), id] as const,
  companies: () => ['companies'] as const,
  receivedAlerts: (payload: FetchReceivedAlertsByDatePayload) => 
    ['receivedAlerts', payload] as const,
  receivedAlertsByCompany: (payload: FetchReceivedAlertsByCompanyIDPayload) => 
    ['receivedAlertsByCompany', payload] as const,
};

// 1. Hook to fetch all newsletters for a user
export const useFetchAllNewsletters = (
  userId: string,
  options?: Omit<UseQueryOptions<FetchAllNewslettersResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchAllNewslettersResponse, Error>({
    queryKey: NEWSLETTER_QUERY_KEYS.list(userId),
    queryFn: async () => {
      const response: AxiosResponse<FetchAllNewslettersResponse> = await ApiService.apiCall(
        'GET',
        `/fetchAlerts/${userId}`,
        null,
        null,
        {},
        true
      );
      
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    ...options,
  });
};

// 2. Hook to fetch all available companies
export const useFetchAllCompanies = (
  options?: Omit<UseQueryOptions<FetchAllCompaniesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchAllCompaniesResponse, Error>({
    queryKey: NEWSLETTER_QUERY_KEYS.companies(),
    queryFn: async () => {
      const response: AxiosResponse<FetchAllCompaniesResponse> = await ApiService.apiCall(
        'GET',
        '/companySpecificAlerts/fetchAvailableCompanies',
        null,
        null,
        {},
        true
      );
      
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes (companies don't change frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    ...options,
  });
};

// 3. Hook to fetch single newsletter data
export const useFetchSingleNewsletterData = (
  newsletterID: string,
  options?: Omit<UseQueryOptions<FetchSingleNewsletterDataResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchSingleNewsletterDataResponse, Error>({
    queryKey: NEWSLETTER_QUERY_KEYS.detail(newsletterID),
    queryFn: async () => {
      const response: AxiosResponse<FetchSingleNewsletterDataResponse> = await ApiService.apiCall(
        'GET',
        `/fetchAlertDetails/${newsletterID}`,
        null,
        null,
        {},
        true
      );
      
      return response.data;
    },
    enabled: !!newsletterID,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    ...options,
  });
};

// 4. Hook to fetch received alerts with payload
export const useFetchReceivedAlertsByDate = (
  payload: FetchReceivedAlertsByDatePayload,
  options?: Omit<UseQueryOptions<FetchReceivedAlertsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchReceivedAlertsResponse, Error>({
    queryKey: NEWSLETTER_QUERY_KEYS.receivedAlerts(payload),
    queryFn: async () => {
      console.log("payload", payload)
      console.log("running....")
      const response: AxiosResponse<FetchReceivedAlertsResponse> = await ApiService.apiCall(
        'POST',
        '/companySpecificAlerts/fetchDeliveryData',
        payload,
        null,
        {},
        true
      );
      console.log("response", response)
      console.log("exited....")
      
      return response.data;
    },
    enabled: !!(payload.user_id && payload.alert_id && payload.start_date && payload.end_date),
    staleTime: 1 * 60 * 1000, // 1 minute (delivery data is more dynamic)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
};

// 5. Hook to fetch received alerts filtered by company IDs
export const useFetchReceivedAlertsByCompanyID = (
  payload: FetchReceivedAlertsByCompanyIDPayload,
  options?: Omit<UseQueryOptions<FetchReceivedAlertsByCompanyIDResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchReceivedAlertsByCompanyIDResponse, Error>({
    queryKey: NEWSLETTER_QUERY_KEYS.receivedAlertsByCompany(payload),
    queryFn: async () => {
      const response: AxiosResponse<FetchReceivedAlertsByCompanyIDResponse> = await ApiService.apiCall(
        'POST',
        '/companySpecificAlerts/fetchDeliveryData',
        payload,
        null,
        {},
        true
      );
      
      return response.data;
    },
    enabled: !!(payload.user_id && payload.alert_id && payload.start_date && payload.end_date && payload.company_ids && payload.company_ids.length > 0),
    staleTime: 1 * 60 * 1000, // 1 minute (delivery data is more dynamic)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
};

// Utility hook for invalidating newsletter queries
export const useNewsletterQueryInvalidation = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAllNewsletters: (userId?: string) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.list(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.lists() });
      }
    },
    invalidateNewsletterDetails: (newsletterID?: string) => {
      if (newsletterID) {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.detail(newsletterID) });
      } else {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.details() });
      }
    },
    invalidateCompanies: () => {
      queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.companies() });
    },
    invalidateReceivedAlerts: (payload?: FetchReceivedAlertsByDatePayload) => {
      if (payload) {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.receivedAlerts(payload) });
      } else {
        queryClient.invalidateQueries({ queryKey: ['receivedAlerts'] });
      }
    },
    invalidateReceivedAlertsByCompany: (payload?: FetchReceivedAlertsByCompanyIDPayload) => {
      if (payload) {
        queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEYS.receivedAlertsByCompany(payload) });
      } else {
        queryClient.invalidateQueries({ queryKey: ['receivedAlertsByCompany'] });
      }
    },
  };
};
