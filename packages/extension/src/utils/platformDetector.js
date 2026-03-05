/**
 * platformDetector — Utilities for detecting the current streaming platform
 * and locating its video/subtitle elements.
 */
const PLATFORM_CONFIGS = {
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
export function detectPlatform() {
    const { hostname } = window.location;
    if (hostname === 'www.youtube.com' || hostname === 'youtube.com')
        return 'youtube';
    if (hostname === 'www.netflix.com' || hostname === 'netflix.com')
        return 'netflix';
    if (hostname === 'www.disneyplus.com' || hostname === 'disneyplus.com')
        return 'disneyplus';
    if (hostname === 'www.primevideo.com' ||
        hostname === 'primevideo.com' ||
        hostname === 'www.amazon.com' ||
        hostname === 'amazon.com')
        return 'amazonprime';
    return 'unknown';
}
/**
 * Returns the primary video element for the current platform.
 */
export function getVideoElement() {
    const platform = detectPlatform();
    if (platform === 'unknown')
        return null;
    const selector = PLATFORM_CONFIGS[platform].videoSelector;
    return document.querySelector(selector);
}
/**
 * Returns the subtitle container element for the current platform.
 */
export function getSubtitleContainer() {
    const platform = detectPlatform();
    if (platform === 'unknown')
        return null;
    const selector = PLATFORM_CONFIGS[platform].subtitleContainerSelector;
    return document.querySelector(selector);
}
/**
 * Returns the full platform configuration object for the current platform.
 */
export function getPlatformConfig() {
    const platform = detectPlatform();
    if (platform === 'unknown')
        return null;
    return PLATFORM_CONFIGS[platform];
}
