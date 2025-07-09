"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session to prevent sharing state between users
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
