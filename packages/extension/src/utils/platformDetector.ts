/**
 * platformDetector — Utilities for detecting the current streaming platform
 * and locating its video/subtitle elements.
 */

/** Supported streaming platforms */
export type Platform = 'youtube' | 'netflix' | 'disneyplus' | 'amazonprime' | 'unknown';

/** Per-platform configuration: CSS selectors and feature flags */
export interface PlatformConfig {
  platform: Platform;
  videoSelector: string;
  subtitleContainerSelector: string;
  /** Whether the platform uses a SPA router (requires URL-change monitoring) */
  isSpa: boolean;
}

const PLATFORM_CONFIGS: Record<Exclude<Platform, 'unknown'>, PlatformConfig> = {
  youtube: {
    platform: 'youtube',
    videoSelector: 'video.html5-main-video',
    subtitleContainerSelector: '.ytp-caption-segment',
    isSpa: true,
  },
  netflix: {
    platform: 'netflix',
    videoSelector: 'video',
    subtitleContainerSelector: '.player-timedtext',
    isSpa: true,
  },
  disneyplus: {
    platform: 'disneyplus',
    videoSelector: 'video',
    subtitleContainerSelector: '[class*="subtitle"]',
    isSpa: true,
  },
  amazonprime: {
    platform: 'amazonprime',
    videoSelector: 'video',
    subtitleContainerSelector: '.atvwebplayersdk-captions-overlay',
    isSpa: true,
  },
};

/**
 * Detects the current streaming platform from the page URL.
 * Uses exact hostname matching to avoid substring spoofing attacks.
 */
export function detectPlatform(): Platform {
  const { hostname } = window.location;
  if (hostname === 'www.youtube.com' || hostname === 'youtube.com') return 'youtube';
  if (hostname === 'www.netflix.com' || hostname === 'netflix.com') return 'netflix';
  if (hostname === 'www.disneyplus.com' || hostname === 'disneyplus.com') return 'disneyplus';
  if (
    hostname === 'www.primevideo.com' ||
    hostname === 'primevideo.com' ||
    hostname === 'www.amazon.com' ||
    hostname === 'amazon.com'
  )
    return 'amazonprime';
  return 'unknown';
}

/**
 * Returns the primary video element for the current platform.
 */
export function getVideoElement(): HTMLVideoElement | null {
  const platform = detectPlatform();
  if (platform === 'unknown') return null;

  const selector = PLATFORM_CONFIGS[platform].videoSelector;
  return document.querySelector<HTMLVideoElement>(selector);
}

/**
 * Returns the subtitle container element for the current platform.
 */
export function getSubtitleContainer(): HTMLElement | null {
  const platform = detectPlatform();
  if (platform === 'unknown') return null;

  const selector = PLATFORM_CONFIGS[platform].subtitleContainerSelector;
  return document.querySelector<HTMLElement>(selector);
}

/**
 * Returns the full platform configuration object for the current platform.
 */
export function getPlatformConfig(): PlatformConfig | null {
  const platform = detectPlatform();
  if (platform === 'unknown') return null;
  return PLATFORM_CONFIGS[platform];
}
