/**
 * SubtitleOverlay — Main content-script React component.
 *
 * Renders dual subtitles (original + translated) floating over the video,
 * supports click-to-translate individual words, multi-phrase selection,
 * subtitle navigation, and an auto-pause toggle.
 */

import React, { useState, useCallback } from 'react';
import { useSubtitles } from '../hooks/useSubtitles';
import { useTranslation } from '../hooks/useTranslation';
import { usePlaybackControl } from '../hooks/usePlaybackControl';
import DictionaryPopup from './DictionaryPopup';

interface Props {
  /** The detected streaming platform */
  platform: 'youtube' | 'netflix' | 'disneyplus' | 'amazonprime' | 'unknown';
}

interface SelectedWord {
  word: string;
  x: number;
  y: number;
}

const SubtitleOverlay: React.FC<Props> = ({ platform }) => {
  const { currentSubtitle, goToNextSubtitle, goToPreviousSubtitle } = useSubtitles(platform);
  const { translateWord, isLoading } = useTranslation();
  const { toggleAutoPause, isAutoPauseEnabled } = usePlaybackControl();

  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const [translation, setTranslation] = useState<string>('');

  /**
   * Handles a click on an individual word token in the subtitle.
   * Triggers translation and positions the DictionaryPopup.
   */
  const handleWordClick = useCallback(
    async (word: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const { clientX: x, clientY: y } = event;
      setSelectedWord({ word, x, y });

      const result = await translateWord(word, 'auto', 'en');
      setTranslation(result ?? '');
    },
    [translateWord]
  );

  const handleCloseDictionary = useCallback(() => {
    setSelectedWord(null);
    setTranslation('');
  }, []);

  if (!currentSubtitle) return null;

  /** Splits subtitle text into clickable word spans */
  const renderWords = (text: string) =>
    text.split(/\s+/).map((word, idx) => (
      <span
        key={idx}
        className="cursor-pointer hover:text-yellow-300 hover:underline transition-colors px-0.5"
        onClick={(e) => handleWordClick(word.replace(/[^\w'-]/g, ''), e)}
      >
        {word}{' '}
      </span>
    ));

  return (
    <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-1 px-4 select-none">
      {/* Original subtitle line */}
      <div className="bg-black/75 text-white text-xl font-semibold px-4 py-2 rounded-lg max-w-3xl text-center leading-relaxed">
        {renderWords(currentSubtitle.text)}
      </div>

      {/* Translated subtitle line */}
      {currentSubtitle.translation && (
        <div className="bg-black/60 text-yellow-200 text-lg px-4 py-1.5 rounded-lg max-w-3xl text-center">
          {currentSubtitle.translation}
        </div>
      )}

      {/* Controls bar */}
      <div className="flex items-center gap-3 mt-1">
        {/* Previous subtitle */}
        <button
          className="bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-full transition"
          onClick={goToPreviousSubtitle}
          title="Previous subtitle (←)"
        >
          ← Prev
        </button>

        {/* Auto-pause toggle */}
        <button
          className={`text-xs px-3 py-1 rounded-full transition ${
            isAutoPauseEnabled ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
          }`}
          onClick={toggleAutoPause}
          title="Toggle auto-pause after each subtitle"
        >
          {isAutoPauseEnabled ? '⏸ Auto-pause ON' : '▶ Auto-pause OFF'}
        </button>

        {/* Next subtitle */}
        <button
          className="bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-full transition"
          onClick={goToNextSubtitle}
          title="Next subtitle (→)"
        >
          Next →
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-white/60 text-xs animate-pulse">Translating…</div>
      )}

      {/* Dictionary popup */}
      {selectedWord && (
        <DictionaryPopup
          word={selectedWord.word}
          translation={translation}
          x={selectedWord.x}
          y={selectedWord.y}
          onClose={handleCloseDictionary}
        />
      )}
    </div>
  );
};

export default SubtitleOverlay;
