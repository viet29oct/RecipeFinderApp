import React from 'react';
import { ErrorView } from './ErrorView';
import { LoadingView } from './LoadingView';

interface AsyncStateProps {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function AsyncState({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  loadingMessage,
  emptyComponent,
  children,
}: AsyncStateProps) {
  if (isLoading) {
    return <LoadingView message={loadingMessage} />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={onRetry} />;
  }

  if (isEmpty && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
}
