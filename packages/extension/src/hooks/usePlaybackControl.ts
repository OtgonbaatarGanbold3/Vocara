/**
 * usePlaybackControl — Platform-agnostic video playback hook.
 *
 * Abstracts video.play/pause/seek across YouTube, Netflix, Disney+, etc.
 * Provides auto-pause after each subtitle line.
 */

import { useState, useCallback } from 'react';
import { getVideoElement } from '../utils/platformDetector';

interface UsePlaybackControlReturn {
  play: () => void;
  pause: () => void;
  seek: (timeSeconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  getCurrentTime: () => number;
  replayCurrentSubtitle: (startTime: number) => void;
  toggleAutoPause: () => void;
  isAutoPauseEnabled: boolean;
}

export function usePlaybackControl(): UsePlaybackControlReturn {
  const [isAutoPauseEnabled, setIsAutoPauseEnabled] = useState(false);

  /** Returns the active video element on the page */
  const getVideo = (): HTMLVideoElement | null => getVideoElement();

  const play = useCallback(() => {
    getVideo()?.play();
  }, []);

  const pause = useCallback(() => {
    getVideo()?.pause();
  }, []);

  const seek = useCallback((timeSeconds: number) => {
    const video = getVideo();
    if (video) video.currentTime = timeSeconds;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = getVideo();
    if (video) video.playbackRate = rate;
  }, []);

  const getCurrentTime = useCallback((): number => {
    return getVideo()?.currentTime ?? 0;
  }, []);

  /**
   * Seeks back to a subtitle's start time and plays it,
   * used for replaying the current line.
   */
  const replayCurrentSubtitle = useCallback((startTime: number) => {
    const video = getVideo();
    if (!video) return;
    video.currentTime = startTime / 1000;
    video.play();
  }, []);

  const toggleAutoPause = useCallback(() => {
    setIsAutoPauseEnabled((prev) => !prev);
  }, []);

  return {
    play,
    pause,
    seek,
    setPlaybackRate,
    getCurrentTime,
    replayCurrentSubtitle,
    toggleAutoPause,
    isAutoPauseEnabled,
  };
}
