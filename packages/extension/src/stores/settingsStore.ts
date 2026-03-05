/**
 * settingsStore — Zustand store for user settings.
 *
 * Persists settings to chrome.storage.sync via a custom middleware.
 */

import { create } from 'zustand';

export interface SettingsState {
  nativeLanguage: string;
  targetLanguage: string;
  subtitleFontSize: number;
  subtitlePosition: 'bottom' | 'top';
  subtitleOpacity: number;
  autoPlay: boolean;
  showTranslation: boolean;
  theme: 'dark' | 'light';

  // Actions
  updateSettings: (updates: Partial<Omit<SettingsState, 'updateSettings' | 'loadSettings' | 'resetSettings'>>) => void;
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  nativeLanguage: 'en',
  targetLanguage: 'es',
  subtitleFontSize: 20,
  subtitlePosition: 'bottom' as const,
  subtitleOpacity: 80,
  autoPlay: false,
  showTranslation: true,
  theme: 'dark' as const,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  updateSettings: (updates) => {
    set(updates);
    // Persist to chrome.storage.sync
    const state = get();
    const { updateSettings: _, loadSettings: __, resetSettings: ___, ...toSave } = state;
    chrome.storage.sync.set({ settings: { ...toSave, ...updates } });
  },

  loadSettings: async () => {
    const result = await chrome.storage.sync.get('settings');
    if (result['settings']) {
      set(result['settings'] as Partial<SettingsState>);
    }
  },

  resetSettings: () => {
    set(DEFAULT_SETTINGS);
    chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
  },
}));
