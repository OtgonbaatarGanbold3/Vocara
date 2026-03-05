/**
 * useTranslation — Custom hook for translating words and phrases.
 *
 * Caches results locally to avoid duplicate API calls.
 * Calls the backend /api/translate endpoint.
 */

import { useState, useCallback, useRef } from 'react';

interface TranslateResponse {
  translation: string;
  partOfSpeech?: string;
  examples?: string[];
  detectedLanguage?: string;
}

interface UseTranslationReturn {
  translateWord: (word: string, sourceLang: string, targetLang: string) => Promise<string | null>;
  translatePhrase: (phrase: string, sourceLang: string, targetLang: string) => Promise<string | null>;
  lastResult: TranslateResponse | null;
  isLoading: boolean;
  error: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function useTranslation(): UseTranslationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<TranslateResponse | null>(null);

  /** Local cache: `${text}|${sourceLang}|${targetLang}` → translation */
  const cache = useRef(new Map<string, TranslateResponse>());

  /**
   * Core translation function used by both translateWord and translatePhrase.
   */
  const translate = useCallback(
    async (
      text: string,
      sourceLang: string,
      targetLang: string,
      type: 'word' | 'phrase'
    ): Promise<string | null> => {
      const cacheKey = `${text}|${sourceLang}|${targetLang}`;
      const cached = cache.current.get(cacheKey);
      if (cached) {
        setLastResult(cached);
        return cached.translation;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, sourceLang, targetLang, type }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = (await res.json()) as TranslateResponse;
        cache.current.set(cacheKey, data);
        setLastResult(data);
        return data.translation;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Translation failed';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const translateWord = useCallback(
    (word: string, sourceLang: string, targetLang: string) =>
      translate(word, sourceLang, targetLang, 'word'),
    [translate]
  );

  const translatePhrase = useCallback(
    (phrase: string, sourceLang: string, targetLang: string) =>
      translate(phrase, sourceLang, targetLang, 'phrase'),
    [translate]
  );

  return { translateWord, translatePhrase, lastResult, isLoading, error };
}
