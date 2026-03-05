/**
 * api — Backend API client.
 *
 * Wraps all calls to the Vocara backend (Vercel serverless functions).
 * Automatically attaches the Supabase auth token to requests.
 */
import { supabase } from './supabaseClient';
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
/** Generic API error */
class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
/** Returns the Authorization header value if the user is signed in. */
async function getAuthHeader() {
    const { data: { session }, } = await supabase.auth.getSession();
    if (!session)
        return {};
    return { Authorization: `Bearer ${session.access_token}` };
}
/** Generic fetch wrapper with error handling. */
async function apiFetch(path, options = {}) {
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
    return res.json();
}
export function translateWord(word, sourceLang, targetLang) {
    return apiFetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text: word, sourceLang, targetLang, type: 'word' }),
    });
}
export function translatePhrase(phrase, sourceLang, targetLang) {
    return apiFetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text: phrase, sourceLang, targetLang, type: 'phrase' }),
    });
}
export function saveVocabulary(item) {
    return apiFetch('/api/vocabulary', {
        method: 'POST',
        body: JSON.stringify(item),
    });
}
export function getProgress() {
    return apiFetch('/api/progress');
}
export function chatWithTutor(message, context, conversationHistory) {
    return apiFetch('/api/ai-tutor', {
        method: 'POST',
        body: JSON.stringify({ message, context, conversationHistory }),
    });
}
