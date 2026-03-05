import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Vocara Popup
 *
 * Displays the current session stats, language pair selector,
 * learning mode toggles, and a link to the side panel / dashboard.
 */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/styles.css';
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
const Popup = () => {
    const [stats, setStats] = useState({
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
            if (result['sessionStats'])
                setStats(result['sessionStats']);
            if (result['settings']) {
                const s = result['settings'];
                if (s.nativeLanguage)
                    setNativeLang(s.nativeLanguage);
                if (s.targetLanguage)
                    setTargetLang(s.targetLanguage);
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
    return (_jsxs("div", { className: "bg-gray-900 text-white p-4 w-80 font-sans", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h1", { className: "text-xl font-bold text-blue-400", children: "\uD83C\uDFAC Vocara" }), _jsx("button", { onClick: handleOpenOptions, className: "text-gray-400 hover:text-white text-lg", title: "Settings", children: "\u2699\uFE0F" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [_jsx(StatCard, { label: "Looked up", value: stats.wordsLookedUp }), _jsx(StatCard, { label: "Saved", value: stats.wordsSaved }), _jsx(StatCard, { label: "Minutes", value: stats.watchTimeMinutes })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: "Language pair" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("select", { value: nativeLang, onChange: (e) => setNativeLang(e.target.value), className: "flex-1 bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm border border-gray-600", children: LANGUAGES.map((l) => (_jsx("option", { value: l.code, children: l.label }, l.code))) }), _jsx("span", { className: "text-gray-400", children: "\u2192" }), _jsx("select", { value: targetLang, onChange: (e) => setTargetLang(e.target.value), className: "flex-1 bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm border border-gray-600", children: LANGUAGES.map((l) => (_jsx("option", { value: l.code, children: l.label }, l.code))) })] })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsx(Toggle, { label: "\uD83D\uDCFA Subtitles", enabled: subtitlesOn, onToggle: setSubtitlesOn }), _jsx(Toggle, { label: "\uD83C\uDFA4 Shadowing mode", enabled: shadowingOn, onToggle: setShadowingOn }), _jsx(Toggle, { label: "\uD83D\uDCDD Dictation mode", enabled: dictationOn, onToggle: setDictationOn })] }), _jsx("button", { onClick: handleOpenSidePanel, className: "w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium text-sm", children: "Open Dashboard \u2192" })] }));
};
const StatCard = ({ label, value }) => (_jsxs("div", { className: "bg-gray-800 rounded-lg p-2 text-center", children: [_jsx("p", { className: "text-lg font-bold text-blue-400", children: value }), _jsx("p", { className: "text-xs text-gray-400", children: label })] }));
const Toggle = ({ label, enabled, onToggle, }) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2", children: [_jsx("span", { className: "text-sm", children: label }), _jsx("button", { onClick: () => onToggle(!enabled), className: `w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-blue-500' : 'bg-gray-600'}`, children: _jsx("span", { className: `absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}` }) })] }));
// Mount React app
const root = createRoot(document.getElementById('root'));
root.render(_jsx(Popup, {}));
