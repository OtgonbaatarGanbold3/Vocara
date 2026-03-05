/**
 * Vocara Background Service Worker
 *
 * Handles message passing between content scripts, popup, and side panel.
 * Manages chrome.storage for settings and vocabulary persistence.
 * Registers the side panel.
 */

/** Supported message action types */
type MessageAction =
  | 'TRANSLATE_WORD'
  | 'TRANSLATE_PHRASE'
  | 'SAVE_VOCABULARY'
  | 'GET_VOCABULARY'
  | 'DELETE_VOCABULARY'
  | 'GET_SETTINGS'
  | 'SAVE_SETTINGS'
  | 'TOGGLE_SUBTITLES'
  | 'OPEN_SIDE_PANEL'
  | 'LOG_SESSION';

/** Base message interface */
interface Message {
  action: MessageAction;
  payload?: unknown;
}

/** Response envelope */
interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ── Side panel registration ────────────────────────────────────────────────

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: false })
  .catch((err: Error) => console.error('[Vocara] sidePanel.setPanelBehavior:', err));

// ── Message handling ───────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    handleMessage(message)
      .then((data) => sendResponse({ success: true, data }))
      .catch((err: Error) => sendResponse({ success: false, error: err.message }));

    // Return true to keep the message channel open for async response
    return true;
  }
);

/**
 * Routes incoming messages to the appropriate handler.
 */
async function handleMessage(message: Message): Promise<unknown> {
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
      return deleteVocabularyItem(message.payload as string);

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
      throw new Error(`Unknown action: ${(message as Message).action}`);
  }
}

// ── Storage helpers ────────────────────────────────────────────────────────

/**
 * Saves a vocabulary item to chrome.storage.local.
 */
async function saveVocabularyItem(item: unknown): Promise<void> {
  const result = await chrome.storage.local.get('vocabulary');
  const vocabulary: unknown[] = result['vocabulary'] ?? [];
  vocabulary.push(item);
  await chrome.storage.local.set({ vocabulary });
}

/**
 * Retrieves all saved vocabulary items from chrome.storage.local.
 */
async function getVocabulary(): Promise<unknown[]> {
  const result = await chrome.storage.local.get('vocabulary');
  return result['vocabulary'] ?? [];
}

/**
 * Deletes a vocabulary item by id from chrome.storage.local.
 */
async function deleteVocabularyItem(id: string): Promise<void> {
  const result = await chrome.storage.local.get('vocabulary');
  const vocabulary: Array<{ id: string }> = result['vocabulary'] ?? [];
  const updated = vocabulary.filter((v) => v.id !== id);
  await chrome.storage.local.set({ vocabulary: updated });
}

/**
 * Retrieves user settings from chrome.storage.sync.
 */
async function getSettings(): Promise<unknown> {
  const result = await chrome.storage.sync.get('settings');
  return result['settings'] ?? {};
}

/**
 * Persists user settings to chrome.storage.sync.
 */
async function saveSettings(settings: unknown): Promise<void> {
  await chrome.storage.sync.set({ settings });
}

/**
 * Sends a message to the content script running in the currently active tab.
 */
async function broadcastToActiveTab(message: Message): Promise<unknown> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id == null) return null;
  return chrome.tabs.sendMessage(tab.id, message);
}
