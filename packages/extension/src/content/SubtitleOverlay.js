import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * SubtitleOverlay — Main content-script React component.
 *
 * Renders dual subtitles (original + translated) floating over the video,
 * supports click-to-translate individual words, multi-phrase selection,
 * subtitle navigation, and an auto-pause toggle.
 */
import { useState, useCallback } from 'react';
import { useSubtitles } from '../hooks/useSubtitles';
import { useTranslation } from '../hooks/useTranslation';
import { usePlaybackControl } from '../hooks/usePlaybackControl';
import DictionaryPopup from './DictionaryPopup';
const SubtitleOverlay = ({ platform }) => {
    const { currentSubtitle, goToNextSubtitle, goToPreviousSubtitle } = useSubtitles(platform);
    const { translateWord, isLoading } = useTranslation();
    const { toggleAutoPause, isAutoPauseEnabled } = usePlaybackControl();
    const [selectedWord, setSelectedWord] = useState(null);
    const [translation, setTranslation] = useState('');
    /**
     * Handles a click on an individual word token in the subtitle.
     * Triggers translation and positions the DictionaryPopup.
     */
    const handleWordClick = useCallback(async (word, event) => {
        event.stopPropagation();
        const { clientX: x, clientY: y } = event;
        setSelectedWord({ word, x, y });
        const result = await translateWord(word, 'auto', 'en');
        setTranslation(result ?? '');
    }, [translateWord]);
    const handleCloseDictionary = useCallback(() => {
        setSelectedWord(null);
        setTranslation('');
    }, []);
    if (!currentSubtitle)
        return null;
    /** Splits subtitle text into clickable word spans */
    const renderWords = (text) => text.split(/\s+/).map((word, idx) => (_jsxs("span", { className: "cursor-pointer hover:text-yellow-300 hover:underline transition-colors px-0.5", onClick: (e) => handleWordClick(word.replace(/[^\w'-]/g, ''), e), children: [word, ' '] }, idx)));
    return (_jsxs("div", { className: "absolute bottom-16 left-0 right-0 flex flex-col items-center gap-1 px-4 select-none", children: [_jsx("div", { className: "bg-black/75 text-white text-xl font-semibold px-4 py-2 rounded-lg max-w-3xl text-center leading-relaxed", children: renderWords(currentSubtitle.text) }), currentSubtitle.translation && (_jsx("div", { className: "bg-black/60 text-yellow-200 text-lg px-4 py-1.5 rounded-lg max-w-3xl text-center", children: currentSubtitle.translation })), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("button", { className: "bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-full transition", onClick: goToPreviousSubtitle, title: "Previous subtitle (\u2190)", children: "\u2190 Prev" }), _jsx("button", { className: `text-xs px-3 py-1 rounded-full transition ${isAutoPauseEnabled ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`, onClick: toggleAutoPause, title: "Toggle auto-pause after each subtitle", children: isAutoPauseEnabled ? '⏸ Auto-pause ON' : '▶ Auto-pause OFF' }), _jsx("button", { className: "bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-full transition", onClick: goToNextSubtitle, title: "Next subtitle (\u2192)", children: "Next \u2192" })] }), isLoading && (_jsx("div", { className: "text-white/60 text-xs animate-pulse", children: "Translating\u2026" })), selectedWord && (_jsx(DictionaryPopup, { word: selectedWord.word, translation: translation, x: selectedWord.x, y: selectedWord.y, onClose: handleCloseDictionary }))] }));
};
export default SubtitleOverlay;
