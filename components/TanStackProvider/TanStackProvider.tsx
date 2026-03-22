'use client';

import { useState } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const TanStackProvider = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default TanStackProvider;
