import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Vocara Options Page
 *
 * Full settings page (opened in a new tab) for:
 * - Language pair selection
 * - Subtitle display preferences
 * - Keyboard shortcuts display
 * - Account and subscription status
 */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/styles.css';
const DEFAULT_SETTINGS = {
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
const Options = () => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        chrome.storage.sync.get('settings', (result) => {
            if (result['settings']) {
                setSettings({ ...DEFAULT_SETTINGS, ...result['settings'] });
            }
        });
    }, []);
    const handleSave = () => {
        chrome.storage.sync.set({ settings }, () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    };
    const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-8 font-sans", children: [_jsx("h1", { className: "text-3xl font-bold text-blue-600 mb-8", children: "\uD83C\uDFAC Vocara Settings" }), _jsx(Section, { title: "Language Pair", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Native language" }), _jsx("select", { value: settings.nativeLanguage, onChange: (e) => update('nativeLanguage', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400", children: LANGUAGES.map((l) => (_jsx("option", { value: l.code, children: l.label }, l.code))) })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Target language" }), _jsx("select", { value: settings.targetLanguage, onChange: (e) => update('targetLanguage', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400", children: LANGUAGES.map((l) => (_jsx("option", { value: l.code, children: l.label }, l.code))) })] })] }) }), _jsx(Section, { title: "Subtitle Display", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "block", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["Font size: ", settings.subtitleFontSize, "px"] }), _jsx("input", { type: "range", min: 12, max: 36, value: settings.subtitleFontSize, onChange: (e) => update('subtitleFontSize', Number(e.target.value)), className: "mt-1 block w-full" })] }), _jsxs("label", { className: "block", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["Opacity: ", settings.subtitleOpacity, "%"] }), _jsx("input", { type: "range", min: 20, max: 100, value: settings.subtitleOpacity, onChange: (e) => update('subtitleOpacity', Number(e.target.value)), className: "mt-1 block w-full" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Position" }), _jsxs("select", { value: settings.subtitlePosition, onChange: (e) => update('subtitlePosition', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400", children: [_jsx("option", { value: "bottom", children: "Bottom" }), _jsx("option", { value: "top", children: "Top" })] })] }), _jsx(ToggleRow, { label: "Show translation subtitle", enabled: settings.showTranslation, onChange: (v) => update('showTranslation', v) }), _jsx(ToggleRow, { label: "Auto-pause after each subtitle", enabled: settings.autoPlay, onChange: (v) => update('autoPlay', v) })] }) }), _jsx(Section, { title: "Keyboard Shortcuts", children: _jsx("table", { className: "w-full text-sm", children: _jsx("tbody", { children: SHORTCUTS.map((s) => (_jsxs("tr", { className: "border-b border-gray-100", children: [_jsx("td", { className: "py-2 font-mono bg-gray-100 rounded px-2 w-24", children: s.key }), _jsx("td", { className: "py-2 pl-4 text-gray-700", children: s.action })] }, s.key))) }) }) }), _jsxs(Section, { title: "Account", children: [_jsx("p", { className: "text-gray-500 text-sm mb-3", children: "Sign in to sync your vocabulary across devices." }), _jsx("button", { className: "bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition text-sm font-medium", children: "Sign in with Google" }), _jsxs("div", { className: "mt-3 text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Subscription:" }), ' ', _jsx("span", { className: "text-gray-400", children: "Free plan" })] })] }), _jsx("button", { onClick: handleSave, className: "bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl transition font-semibold text-base", children: saved ? '✓ Saved!' : 'Save Settings' })] }));
};
const Section = ({ title, children }) => (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2", children: title }), children] }));
const ToggleRow = ({ label, enabled, onChange, }) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-700", children: label }), _jsx("button", { onClick: () => onChange(!enabled), className: `w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`, children: _jsx("span", { className: `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}` }) })] }));
const root = createRoot(document.getElementById('root'));
root.render(_jsx(Options, {}));
