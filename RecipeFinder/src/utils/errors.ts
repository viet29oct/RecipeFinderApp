import { isAxiosError } from 'axios';

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi không xác định';
}

export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string; code?: string }
      | undefined;
    const message =
      responseData?.message ?? error.message ?? 'Không thể kết nối máy chủ';
    const code = responseData?.code ?? 'API_ERROR';
    return new ApiError(code, message, status);
  }

  if (error instanceof Error) {
    return new ApiError('UNKNOWN', error.message);
  }

  return new ApiError('UNKNOWN', 'Đã xảy ra lỗi không xác định');
}
