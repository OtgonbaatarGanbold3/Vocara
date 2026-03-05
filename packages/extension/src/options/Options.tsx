/**
 * Vocara Options Page
 *
 * Full settings page (opened in a new tab) for:
 * - Language pair selection
 * - Subtitle display preferences
 * - Keyboard shortcuts display
 * - Account and subscription status
 */

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/styles.css';

interface Settings {
  nativeLanguage: string;
  targetLanguage: string;
  subtitleFontSize: number;
  subtitlePosition: 'bottom' | 'top';
  subtitleOpacity: number;
  autoPlay: boolean;
  showTranslation: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  nativeLanguage: 'en',
  targetLanguage: 'es',
  subtitleFontSize: 20,
  subtitlePosition: 'bottom',
  subtitleOpacity: 80,
  autoPlay: false,
  showTranslation: true,
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese (Simplified)' },
  { code: 'ko', label: 'Korean' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'ru', label: 'Russian' },
];

const SHORTCUTS = [
  { key: 'Space', action: 'Pause / play' },
  { key: '←', action: 'Previous subtitle' },
  { key: '→', action: 'Next subtitle' },
  { key: 'R', action: 'Replay current subtitle' },
  { key: 'S', action: 'Toggle shadowing mode' },
  { key: 'D', action: 'Toggle dictation mode' },
];

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('settings', (result) => {
      if (result['settings']) {
        setSettings({ ...DEFAULT_SETTINGS, ...(result['settings'] as Partial<Settings>) });
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">🎬 Vocara Settings</h1>

      {/* Language pair */}
      <Section title="Language Pair">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Native language</span>
            <select
              value={settings.nativeLanguage}
              onChange={(e) => update('nativeLanguage', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Target language</span>
            <select
              value={settings.targetLanguage}
              onChange={(e) => update('targetLanguage', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      {/* Subtitle display */}
      <Section title="Subtitle Display">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">Font size: {settings.subtitleFontSize}px</span>
            <input
              type="range"
              min={12}
              max={36}
              value={settings.subtitleFontSize}
              onChange={(e) => update('subtitleFontSize', Number(e.target.value))}
              className="mt-1 block w-full"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">
              Opacity: {settings.subtitleOpacity}%
            </span>
            <input
              type="range"
              min={20}
              max={100}
              value={settings.subtitleOpacity}
              onChange={(e) => update('subtitleOpacity', Number(e.target.value))}
              className="mt-1 block w-full"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Position</span>
            <select
              value={settings.subtitlePosition}
              onChange={(e) => update('subtitlePosition', e.target.value as 'bottom' | 'top')}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
          </label>
          <ToggleRow
            label="Show translation subtitle"
            enabled={settings.showTranslation}
            onChange={(v) => update('showTranslation', v)}
          />
          <ToggleRow
            label="Auto-pause after each subtitle"
            enabled={settings.autoPlay}
            onChange={(v) => update('autoPlay', v)}
          />
        </div>
      </Section>

      {/* Keyboard shortcuts */}
      <Section title="Keyboard Shortcuts">
        <table className="w-full text-sm">
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.key} className="border-b border-gray-100">
                <td className="py-2 font-mono bg-gray-100 rounded px-2 w-24">{s.key}</td>
                <td className="py-2 pl-4 text-gray-700">{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Account */}
      <Section title="Account">
        <p className="text-gray-500 text-sm mb-3">
          Sign in to sync your vocabulary across devices.
        </p>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition text-sm font-medium">
          Sign in with Google
        </button>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Subscription:</span>{' '}
          <span className="text-gray-400">Free plan</span>
        </div>
      </Section>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl transition font-semibold text-base"
      >
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const ToggleRow: React.FC<{ label: string; enabled: boolean; onChange: (v: boolean) => void }> = ({
  label,
  enabled,
  onChange,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
