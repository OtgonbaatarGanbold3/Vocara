import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * DictionaryPopup — Translation popup component.
 *
 * Displayed near a clicked word and shows its translation,
 * part of speech, example sentences, and provides a "Save to vocabulary"
 * button plus audio pronunciation via Web Speech Synthesis.
 */
import { useEffect, useRef } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
const DictionaryPopup = ({ word, translation, x, y, partOfSpeech, examples = [], onClose, }) => {
    const { saveWord } = useVocabulary();
    const popupRef = useRef(null);
    /** Close popup when clicking outside */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    /** Speak the word using the Web Speech Synthesis API */
    const handleSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    };
    const handleSave = () => {
        saveWord({
            id: crypto.randomUUID(),
            word,
            translation,
            partOfSpeech,
            contextSentence: examples[0],
            createdAt: new Date().toISOString(),
            nextReviewAt: new Date().toISOString(),
            reviewCount: 0,
            easeFactor: 2.5,
        });
        onClose();
    };
    return (_jsxs("div", { ref: popupRef, className: "fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-72 border border-gray-700", style: { left: Math.min(x, window.innerWidth - 300), top: Math.max(y - 160, 10) }, children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("span", { className: "text-lg font-bold", children: word }), partOfSpeech && (_jsx("span", { className: "ml-2 text-xs text-gray-400 italic", children: partOfSpeech }))] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white ml-2 text-lg leading-none", children: "\u00D7" })] }), _jsx("div", { className: "text-yellow-300 text-base mb-3", children: translation || 'Loading…' }), examples.length > 0 && (_jsxs("div", { className: "mb-3 text-sm text-gray-300 border-t border-gray-700 pt-2", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Example" }), _jsx("p", { className: "italic", children: examples[0] })] })), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { onClick: handleSpeak, className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-1.5 rounded-lg transition", title: "Hear pronunciation", children: "\uD83D\uDD0A Listen" }), _jsx("button", { onClick: handleSave, className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-1.5 rounded-lg transition", title: "Save to vocabulary list", children: "\uD83D\uDCBE Save" })] })] }));
};
export default DictionaryPopup;
