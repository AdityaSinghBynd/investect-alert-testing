import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { ApiService } from "@/services/service";
import { AxiosResponse } from "axios";
import { NEWSLETTER_QUERY_KEYS } from '../Newsletter/useNewsletter';
import {
  CreateNewsletterPayload,
  CreateNewsletterResponse,
  DeleteNewsletterPayload,
  DeleteCompanyPayload,
  EmailSendPayload,
  SubmitUpdatedDataPayload,
  OperationResponse,
  SuccessResponse,
  ApiErrorResponse,
} from './newsletterOperations.interface';

// 1. Hook to create a new newsletter
export const useCreateNewsletter = (
  options?: UseMutationOptions<CreateNewsletterResponse, Error, CreateNewsletterPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<CreateNewsletterResponse, Error, CreateNewsletterPayload>({
    mutationFn: async (payload: CreateNewsletterPayload) => {
      const response: AxiosResponse<CreateNewsletterResponse> = await ApiService.apiCall(
        'POST',
        '/registerAlert',
        payload,
        null,
        {},
        true
      );
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate newsletters list for the user
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.list(variables.user_id) 
      });
      
      // Invalidate all newsletters lists
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.lists() 
      });
      
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create newsletter:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// 2. Hook to delete a newsletter
export const useDeleteNewsletter = (
  options?: UseMutationOptions<SuccessResponse, Error, DeleteNewsletterPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, DeleteNewsletterPayload>({
    mutationFn: async (payload: DeleteNewsletterPayload) => {
      const response: AxiosResponse<SuccessResponse> = await ApiService.apiCall(
        'DELETE',
        `/deleteAlert/${payload.userID}/${payload.newsletterID}`,
        null,
        null,
        {},
        true
      );
      
      return response.data || { success: true, message: 'Newsletter deleted successfully' };
    },
    onSuccess: (data, variables) => {
      // Invalidate newsletters list for the user
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.list(variables.userID) 
      });
      
      // Invalidate specific newsletter details
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.detail(variables.newsletterID) 
      });
      
      // Remove the specific newsletter from cache
      queryClient.removeQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.detail(variables.newsletterID) 
      });
      
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete newsletter:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// 3. Hook to delete a company from newsletter
export const useDeleteCompany = (
  options?: UseMutationOptions<SuccessResponse, Error, DeleteCompanyPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, DeleteCompanyPayload>({
    mutationFn: async (payload: DeleteCompanyPayload) => {
      const response: AxiosResponse<SuccessResponse> = await ApiService.apiCall(
        'DELETE',
        `/companySpecificAlerts/deleteCompany/${payload.userID}/${payload.companyID}`,
        null,
        null,
        {},
        true
      );
      
      return response.data || { success: true, message: 'Company deleted successfully' };
    },
    onSuccess: (data, variables) => {
      // Invalidate newsletters list for the user
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.list(variables.userID) 
      });
      
      // Invalidate companies list
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.companies() 
      });
      
      // Invalidate all newsletter details (since company was removed)
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.details() 
      });
      
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete company:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// 4. Hook to send bulk email
export const useEmailSend = (
  options?: UseMutationOptions<SuccessResponse, Error, EmailSendPayload>
) => {
  return useMutation<SuccessResponse, Error, EmailSendPayload>({
    mutationFn: async (payload: EmailSendPayload) => {
      const response: AxiosResponse<SuccessResponse> = await ApiService.apiCall(
        'POST',
        '/sendBulkEmail',
        payload,
        null,
        {},
        true
      );
      
      return response.data || { success: true, message: 'Emails sent successfully' };
    },
    onSuccess: (data, variables) => {
      console.log(`Bulk email sent to ${variables.emails.length} recipients`);
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      console.error('Failed to send bulk email:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// 5. Hook to submit updated data in newsletter template
export const useSubmitUpdatedDataInNewsletterTemplate = (
  options?: UseMutationOptions<SuccessResponse, Error, SubmitUpdatedDataPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, SubmitUpdatedDataPayload>({
    mutationFn: async (payload: SubmitUpdatedDataPayload) => {
      const response: AxiosResponse<SuccessResponse> = await ApiService.apiCall(
        'POST',
        '/companySpecificAlerts/submitUpdatedData',
        payload,
        null,
        {},
        true
      );
      
      return response.data || { success: true, message: 'Data submitted successfully' };
    },
    onSuccess: (data, variables) => {
      // Invalidate newsletter details for the specific alert
      queryClient.invalidateQueries({ 
        queryKey: NEWSLETTER_QUERY_KEYS.detail(variables.alert_id) 
      });
      
      // Invalidate received alerts that might be affected
      queryClient.invalidateQueries({ 
        queryKey: ['receivedAlerts'] 
      });
      
      // Invalidate received alerts by company
      queryClient.invalidateQueries({ 
        queryKey: ['receivedAlertsByCompany'] 
      });
      
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      console.error('Failed to submit updated data:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Utility hook for newsletter operations
export const useNewsletterOperations = () => {
  const createNewsletter = useCreateNewsletter();
  const deleteNewsletter = useDeleteNewsletter();
  const deleteCompany = useDeleteCompany();
  const emailSend = useEmailSend();
  const submitUpdatedData = useSubmitUpdatedDataInNewsletterTemplate();

  return {
    // Mutations
    createNewsletter,
    deleteNewsletter,
    deleteCompany,
    emailSend,
    submitUpdatedData,
    
    // Helper functions
    isCreating: createNewsletter.isPending,
    isDeleting: deleteNewsletter.isPending || deleteCompany.isPending,
    isSendingEmail: emailSend.isPending,
    isSubmittingData: submitUpdatedData.isPending,
    
    // Combined loading state
    isLoading: createNewsletter.isPending || 
               deleteNewsletter.isPending || 
               deleteCompany.isPending || 
               emailSend.isPending || 
               submitUpdatedData.isPending,
  };
};

// Individual hooks are already exported above with their declarations
