/**
 * api — Backend API client.
 *
 * Wraps all calls to the Vocara backend (Vercel serverless functions).
 * Automatically attaches the Supabase auth token to requests.
 */

import { supabase } from './supabaseClient';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

/** Generic API error */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Returns the Authorization header value if the user is signed in. */
async function getAuthHeader(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

/** Generic fetch wrapper with error handling. */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(body || `HTTP ${res.status}`, res.status);
  }

  return res.json() as Promise<T>;
}

// ── Public API functions ────────────────────────────────────────────────

export interface TranslateResponse {
  translation: string;
  partOfSpeech?: string;
  examples?: string[];
  detectedLanguage?: string;
}

export function translateWord(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslateResponse> {
  return apiFetch<TranslateResponse>('/api/translate', {
    method: 'POST',
    body: JSON.stringify({ text: word, sourceLang, targetLang, type: 'word' }),
  });
}

export function translatePhrase(
  phrase: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslateResponse> {
  return apiFetch<TranslateResponse>('/api/translate', {
    method: 'POST',
    body: JSON.stringify({ text: phrase, sourceLang, targetLang, type: 'phrase' }),
  });
}

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  contextSentence?: string;
}

export function saveVocabulary(item: VocabItem): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/api/vocabulary', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export interface ProgressStats {
  wordsLearned: number;
  watchTimeMinutes: number;
  streakDays: number;
}

export function getProgress(): Promise<ProgressStats> {
  return apiFetch<ProgressStats>('/api/progress');
}

export interface TutorResponse {
  response: string;
  suggestions?: string[];
}

export function chatWithTutor(
  message: string,
  context?: string,
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
): Promise<TutorResponse> {
  return apiFetch<TutorResponse>('/api/ai-tutor', {
    method: 'POST',
    body: JSON.stringify({ message, context, conversationHistory }),
  });
}
