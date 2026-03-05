"use strict";
/**
 * Vocara Background Service Worker
 *
 * Handles message passing between content scripts, popup, and side panel.
 * Manages chrome.storage for settings and vocabulary persistence.
 * Registers the side panel.
 */
// ── Side panel registration ────────────────────────────────────────────────
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((err) => console.error('[Vocara] sidePanel.setPanelBehavior:', err));
// ── Message handling ───────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message)
        .then((data) => sendResponse({ success: true, data }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
    // Return true to keep the message channel open for async response
    return true;
});
/**
 * Routes incoming messages to the appropriate handler.
 */
async function handleMessage(message) {
    switch (message.action) {
        case 'TRANSLATE_WORD':
        case 'TRANSLATE_PHRASE': {
            // Proxy translation request to backend API
            // TODO: call /api/translate endpoint
            return { translation: '' };
        }
        case 'SAVE_VOCABULARY':
            return saveVocabularyItem(message.payload);
        case 'GET_VOCABULARY':
            return getVocabulary();
        case 'DELETE_VOCABULARY':
            return deleteVocabularyItem(message.payload);
        case 'GET_SETTINGS':
            return getSettings();
        case 'SAVE_SETTINGS':
            return saveSettings(message.payload);
        case 'TOGGLE_SUBTITLES':
            // Broadcast to the active tab's content script
            return broadcastToActiveTab(message);
        case 'OPEN_SIDE_PANEL': {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab?.windowId != null) {
                await chrome.sidePanel.open({ windowId: tab.windowId });
            }
            return null;
        }
        case 'LOG_SESSION':
            // TODO: sync session data to Supabase
            return null;
        default:
            throw new Error(`Unknown action: ${message.action}`);
    }
}
// ── Storage helpers ────────────────────────────────────────────────────────
/**
 * Saves a vocabulary item to chrome.storage.local.
 */
async function saveVocabularyItem(item) {
    const result = await chrome.storage.local.get('vocabulary');
    const vocabulary = result['vocabulary'] ?? [];
    vocabulary.push(item);
    await chrome.storage.local.set({ vocabulary });
}
/**
 * Retrieves all saved vocabulary items from chrome.storage.local.
 */
async function getVocabulary() {
    const result = await chrome.storage.local.get('vocabulary');
    return result['vocabulary'] ?? [];
}
/**
 * Deletes a vocabulary item by id from chrome.storage.local.
 */
async function deleteVocabularyItem(id) {
    const result = await chrome.storage.local.get('vocabulary');
    const vocabulary = result['vocabulary'] ?? [];
    const updated = vocabulary.filter((v) => v.id !== id);
    await chrome.storage.local.set({ vocabulary: updated });
}
/**
 * Retrieves user settings from chrome.storage.sync.
 */
async function getSettings() {
    const result = await chrome.storage.sync.get('settings');
    return result['settings'] ?? {};
}
/**
 * Persists user settings to chrome.storage.sync.
 */
async function saveSettings(settings) {
    await chrome.storage.sync.set({ settings });
}
/**
 * Sends a message to the content script running in the currently active tab.
 */
async function broadcastToActiveTab(message) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id == null)
        return null;
    return chrome.tabs.sendMessage(tab.id, message);
}
