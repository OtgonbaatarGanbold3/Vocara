/**
 * useSubtitles — Custom hook for subtitle state and navigation.
 *
 * Provides the current subtitle, subtitle list, and navigation functions.
 * Platform-aware subtitle fetching is stubbed with clear TODO comments.
 */

import { useState, useEffect, useCallback } from 'react';

/** Represents a single subtitle entry */
export interface Subtitle {
  id: string;
  startTime: number; // milliseconds
  endTime: number; // milliseconds
  text: string;
  translation?: string;
}

type Platform = 'youtube' | 'netflix' | 'disneyplus' | 'amazonprime' | 'unknown';

interface UseSubtitlesReturn {
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
  currentIndex: number;
  goToNextSubtitle: () => void;
  goToPreviousSubtitle: () => void;
  getCurrentSubtitle: () => Subtitle | null;
  fetchSubtitles: () => Promise<void>;
}

export function useSubtitles(platform: Platform): UseSubtitlesReturn {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Fetches subtitles for the current content.
   * Each platform requires its own extraction logic.
   */
  const fetchSubtitles = useCallback(async (): Promise<void> => {
    switch (platform) {
      case 'netflix':
        // TODO: Intercept Netflix's timedtext API responses
        break;
      case 'youtube':
        // TODO: Use YouTube Data API or intercept timedtext XHR
        break;
      case 'disneyplus':
        // TODO: Parse Disney+ TTML subtitle tracks
        break;
      case 'amazonprime':
        // TODO: Intercept Amazon Prime Video subtitle responses
        break;
      default:
        break;
    }

    // Placeholder: use empty list until platform integration is implemented
    setSubtitles([]);
  }, [platform]);

  useEffect(() => {
    fetchSubtitles();
  }, [fetchSubtitles]);

  const currentSubtitle = subtitles[currentIndex] ?? null;

  const goToNextSubtitle = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, subtitles.length - 1));
  }, [subtitles.length]);

  const goToPreviousSubtitle = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const getCurrentSubtitle = useCallback((): Subtitle | null => {
    return subtitles[currentIndex] ?? null;
  }, [subtitles, currentIndex]);

  return {
    subtitles,
    currentSubtitle,
    currentIndex,
    goToNextSubtitle,
    goToPreviousSubtitle,
    getCurrentSubtitle,
    fetchSubtitles,
  };
}
