import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

const defaultOptions = {
  queries: {
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions }));

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
