/**
 * useVocabulary — Custom hook for vocabulary CRUD operations.
 *
 * Offline-first: saves to chrome.storage.local and syncs to Supabase when online.
 * Provides exportToAnki for generating downloadable Anki decks.
 */

import { useState, useEffect, useCallback } from 'react';
import { generateAnkiDeck } from '../utils/ankiExport';

/** Represents a saved vocabulary item */
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  partOfSpeech?: string;
  contextSentence?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  /** ISO date string for next SRS review */
  nextReviewAt: string;
  reviewCount: number;
  /** SM-2 ease factor */
  easeFactor: number;
  createdAt: string;
}

interface UseVocabularyReturn {
  vocabulary: VocabularyItem[];
  isLoading: boolean;
  saveWord: (item: VocabularyItem) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  getVocabulary: () => Promise<void>;
  updateReviewStatus: (id: string, updates: Partial<VocabularyItem>) => Promise<void>;
  exportToAnki: () => void;
}

export function useVocabulary(): UseVocabularyReturn {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /** Loads vocabulary from chrome.storage.local */
  const getVocabulary = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await chrome.storage.local.get('vocabulary');
      setVocabulary((result['vocabulary'] as VocabularyItem[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getVocabulary();
  }, [getVocabulary]);

  /** Saves a new word to local storage */
  const saveWord = useCallback(
    async (item: VocabularyItem): Promise<void> => {
      const updated = [...vocabulary, item];
      await chrome.storage.local.set({ vocabulary: updated });
      setVocabulary(updated);
      // TODO: sync to Supabase when navigator.onLine is true
    },
    [vocabulary]
  );

  /** Deletes a word by id */
  const deleteWord = useCallback(
    async (id: string): Promise<void> => {
      const updated = vocabulary.filter((v) => v.id !== id);
      await chrome.storage.local.set({ vocabulary: updated });
      setVocabulary(updated);
    },
    [vocabulary]
  );

  /** Updates review status (SRS data) for a word */
  const updateReviewStatus = useCallback(
    async (id: string, updates: Partial<VocabularyItem>): Promise<void> => {
      const updated = vocabulary.map((v) => (v.id === id ? { ...v, ...updates } : v));
      await chrome.storage.local.set({ vocabulary: updated });
      setVocabulary(updated);
      // TODO: sync to Supabase
    },
    [vocabulary]
  );

  /** Generates and triggers download of an Anki-importable TSV file */
  const exportToAnki = useCallback(() => {
    const content = generateAnkiDeck(vocabulary);
    const blob = new Blob([content], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocara-anki.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [vocabulary]);

  return { vocabulary, isLoading, saveWord, deleteWord, getVocabulary, updateReviewStatus, exportToAnki };
}
