/**
 * Runtime config from EXPO_PUBLIC_* (inlined at build time).
 * @see .env.example
 */
function readEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value !== undefined && value !== '' ? value : fallback;
}

function readNumber(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  apiUrl: readEnv('EXPO_PUBLIC_API_URL', 'http://localhost:8080/api/v1'),
  apiTimeoutMs: readNumber('EXPO_PUBLIC_API_TIMEOUT_MS', 15_000),
} as const;
