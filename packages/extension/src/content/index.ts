/**
 * Vocara Content Script Entry Point
 *
 * Detects the current streaming platform, locates the video element,
 * mounts the React overlay into an isolated Shadow DOM, and listens
 * for SPA navigation changes to remount when needed.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { detectPlatform } from '../utils/platformDetector';
import SubtitleOverlay from './SubtitleOverlay';

const CONTAINER_ID = 'vocara-root';

/**
 * Creates a Shadow DOM host and mounts the React overlay app into it.
 * Using Shadow DOM ensures extension styles don't bleed into the host page.
 */
function mountOverlay(): void {
  // Avoid duplicate mounts
  if (document.getElementById(CONTAINER_ID)) return;

  const platform = detectPlatform();
  if (platform === 'unknown') return;

  const host = document.createElement('div');
  host.id = CONTAINER_ID;
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.pointerEvents = 'none';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '100%';
  host.style.height = '100%';

  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Inject Tailwind styles into the Shadow DOM
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = chrome.runtime.getURL('src/content/styles.css');
  shadowRoot.appendChild(style);

  const reactContainer = document.createElement('div');
  reactContainer.style.pointerEvents = 'auto';
  shadowRoot.appendChild(reactContainer);

  document.documentElement.appendChild(host);

  const root = createRoot(reactContainer);
  root.render(React.createElement(SubtitleOverlay, { platform }));
}

/**
 * Removes the mounted overlay (used before remounting on navigation).
 */
function unmountOverlay(): void {
  const host = document.getElementById(CONTAINER_ID);
  if (host) host.remove();
}

// Initial mount
mountOverlay();

// ── SPA navigation support ─────────────────────────────────────────────────

let lastUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    unmountOverlay();
    // Small delay to let the new page render its video element
    setTimeout(mountOverlay, 1500);
  }
});

observer.observe(document.body, { subtree: true, childList: true });
