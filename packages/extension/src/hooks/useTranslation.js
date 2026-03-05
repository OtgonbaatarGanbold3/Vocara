/**
 * useTranslation — Custom hook for translating words and phrases.
 *
 * Caches results locally to avoid duplicate API calls.
 * Calls the backend /api/translate endpoint.
 */
import { useState, useCallback, useRef } from 'react';
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export function useTranslation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    /** Local cache: `${text}|${sourceLang}|${targetLang}` → translation */
    const cache = useRef(new Map());
    /**
     * Core translation function used by both translateWord and translatePhrase.
     */
    const translate = useCallback(async (text, sourceLang, targetLang, type) => {
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
            if (!res.ok)
                throw new Error(`API error: ${res.status}`);
            const data = (await res.json());
            cache.current.set(cacheKey, data);
            setLastResult(data);
            return data.translation;
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Translation failed';
            setError(msg);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const translateWord = useCallback((word, sourceLang, targetLang) => translate(word, sourceLang, targetLang, 'word'), [translate]);
    const translatePhrase = useCallback((phrase, sourceLang, targetLang) => translate(phrase, sourceLang, targetLang, 'phrase'), [translate]);
    return { translateWord, translatePhrase, lastResult, isLoading, error };
}
