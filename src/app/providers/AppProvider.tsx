import { useState, type ReactNode } from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/services/api/errors'
import { ToastProvider } from '@/components/feedback/ToastProvider'
import { AuthProvider } from './AuthProvider'

/**
 * Composes global providers:
 *
 *   QueryClient (server state)
 *     └── Toast
 *           └── Auth
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Never retry client errors; retry transient/server errors once.
              if (
                error instanceof ApiError &&
                error.status >= 400 &&
                error.status < 500
              ) {
                return false
              }
              return failureCount < 1
            },
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

function handleQueryError(): void {
  // Global query error handler.
}
