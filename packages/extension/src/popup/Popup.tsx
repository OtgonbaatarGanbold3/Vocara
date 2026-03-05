/**
 * Vocara Popup
 *
 * Displays the current session stats, language pair selector,
 * learning mode toggles, and a link to the side panel / dashboard.
 */

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/styles.css';

interface SessionStats {
  wordsLookedUp: number;
  wordsSaved: number;
  watchTimeMinutes: number;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ko', label: 'Korean' },
  { code: 'pt', label: 'Portuguese' },
];

const Popup: React.FC = () => {
  const [stats, setStats] = useState<SessionStats>({
    wordsLookedUp: 0,
    wordsSaved: 0,
    watchTimeMinutes: 0,
  });
  const [nativeLang, setNativeLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [shadowingOn, setShadowingOn] = useState(false);
  const [dictationOn, setDictationOn] = useState(false);

  useEffect(() => {
    // Load session stats and settings from storage
    chrome.storage.local.get(['sessionStats', 'settings'], (result) => {
      if (result['sessionStats']) setStats(result['sessionStats'] as SessionStats);
      if (result['settings']) {
        const s = result['settings'] as { nativeLanguage?: string; targetLanguage?: string };
        if (s.nativeLanguage) setNativeLang(s.nativeLanguage);
        if (s.targetLanguage) setTargetLang(s.targetLanguage);
      }
    });
  }, []);

  const handleOpenSidePanel = () => {
    chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
    window.close();
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
    window.close();
  };

  return (
    <div className="bg-gray-900 text-white p-4 w-80 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-blue-400">🎬 Vocara</h1>
        <button
          onClick={handleOpenOptions}
          className="text-gray-400 hover:text-white text-lg"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatCard label="Looked up" value={stats.wordsLookedUp} />
        <StatCard label="Saved" value={stats.wordsSaved} />
        <StatCard label="Minutes" value={stats.watchTimeMinutes} />
      </div>

      {/* Language pair */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-1">Language pair</p>
        <div className="flex items-center gap-2">
          <select
            value={nativeLang}
            onChange={(e) => setNativeLang(e.target.value)}
            className="flex-1 bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm border border-gray-600"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <span className="text-gray-400">→</span>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm border border-gray-600"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode toggles */}
      <div className="space-y-2 mb-4">
        <Toggle label="📺 Subtitles" enabled={subtitlesOn} onToggle={setSubtitlesOn} />
        <Toggle label="🎤 Shadowing mode" enabled={shadowingOn} onToggle={setShadowingOn} />
        <Toggle label="📝 Dictation mode" enabled={dictationOn} onToggle={setDictationOn} />
      </div>

      {/* Open side panel */}
      <button
        onClick={handleOpenSidePanel}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium text-sm"
      >
        Open Dashboard →
      </button>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-800 rounded-lg p-2 text-center">
    <p className="text-lg font-bold text-blue-400">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: (v: boolean) => void }> = ({
  label,
  enabled,
  onToggle,
}) => (
  <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
    <span className="text-sm">{label}</span>
    <button
      onClick={() => onToggle(!enabled)}
      className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
);

// Mount React app
const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
