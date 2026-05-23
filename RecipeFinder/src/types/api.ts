/** Standard API envelope when backend wraps payloads */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
}
