import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook providing utility functions for working with React Query
 */
export const useQueryUtils = () => {
  const queryClient = useQueryClient();

  

  /**
   * Clear all query cache data
   */
  const clearQueryCache = () => {
    queryClient.clear();
  };
  
  /**
   * Set initial data for a query
   */
  const setQueryData = (queryKey: any[], data: any) => {
    queryClient.setQueryData(queryKey, data);
  };
  
  return {
    clearQueryCache,
    setQueryData,
    queryClient, // export the queryClient for advanced use cases if needed
  };
}; 