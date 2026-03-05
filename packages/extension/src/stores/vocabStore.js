/**
 * vocabStore — Zustand store for vocabulary state.
 *
 * Tracks words looked up in the current session and persisted saved words.
 */
import { create } from 'zustand';
export const useVocabStore = create((set) => ({
    currentSessionWords: [],
    savedWords: [],
    isLoading: false,
    addWord: (item) => set((state) => ({
        currentSessionWords: [...state.currentSessionWords, item],
        savedWords: state.savedWords.find((w) => w.id === item.id)
            ? state.savedWords
            : [...state.savedWords, item],
    })),
    removeWord: (id) => set((state) => ({
        currentSessionWords: state.currentSessionWords.filter((w) => w.id !== id),
        savedWords: state.savedWords.filter((w) => w.id !== id),
    })),
    clearSession: () => set({ currentSessionWords: [] }),
    loadSavedWords: async () => {
        set({ isLoading: true });
        try {
            const result = await chrome.storage.local.get('vocabulary');
            set({ savedWords: result['vocabulary'] ?? [] });
        }
        finally {
            set({ isLoading: false });
        }
    },
}));
