"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export default function QCP({ children }: HaveChild) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
