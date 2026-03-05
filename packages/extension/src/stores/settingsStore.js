/**
 * settingsStore — Zustand store for user settings.
 *
 * Persists settings to chrome.storage.sync via a custom middleware.
 */
import { create } from 'zustand';
const DEFAULT_SETTINGS = {
    nativeLanguage: 'en',
    targetLanguage: 'es',
    subtitleFontSize: 20,
    subtitlePosition: 'bottom',
    subtitleOpacity: 80,
    autoPlay: false,
    showTranslation: true,
    theme: 'dark',
};
export const useSettingsStore = create((set, get) => ({
    ...DEFAULT_SETTINGS,
    updateSettings: (updates) => {
        set(updates);
        // Persist to chrome.storage.sync
        const { nativeLanguage, targetLanguage, subtitleFontSize, subtitlePosition, subtitleOpacity, autoPlay, showTranslation, theme } = get();
        const toSave = { nativeLanguage, targetLanguage, subtitleFontSize, subtitlePosition, subtitleOpacity, autoPlay, showTranslation, theme, ...updates };
        chrome.storage.sync.set({ settings: toSave });
    },
    loadSettings: async () => {
        const result = await chrome.storage.sync.get('settings');
        if (result['settings']) {
            set(result['settings']);
        }
    },
    resetSettings: () => {
        set(DEFAULT_SETTINGS);
        chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    },
}));
