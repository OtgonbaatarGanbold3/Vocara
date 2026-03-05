/**
 * DictionaryPopup — Translation popup component.
 *
 * Displayed near a clicked word and shows its translation,
 * part of speech, example sentences, and provides a "Save to vocabulary"
 * button plus audio pronunciation via Web Speech Synthesis.
 */

import React, { useEffect, useRef } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';

interface Props {
  word: string;
  translation: string;
  /** Approximate viewport X position to position the popup */
  x: number;
  /** Approximate viewport Y position to position the popup */
  y: number;
  partOfSpeech?: string;
  examples?: string[];
  onClose: () => void;
}

const DictionaryPopup: React.FC<Props> = ({
  word,
  translation,
  x,
  y,
  partOfSpeech,
  examples = [],
  onClose,
}) => {
  const { saveWord } = useVocabulary();
  const popupRef = useRef<HTMLDivElement>(null);

  /** Close popup when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
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

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-72 border border-gray-700"
      style={{ left: Math.min(x, window.innerWidth - 300), top: Math.max(y - 160, 10) }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-lg font-bold">{word}</span>
          {partOfSpeech && (
            <span className="ml-2 text-xs text-gray-400 italic">{partOfSpeech}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white ml-2 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Translation */}
      <div className="text-yellow-300 text-base mb-3">{translation || 'Loading…'}</div>

      {/* Example sentences */}
      {examples.length > 0 && (
        <div className="mb-3 text-sm text-gray-300 border-t border-gray-700 pt-2">
          <p className="text-xs text-gray-500 mb-1">Example</p>
          <p className="italic">{examples[0]}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSpeak}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-1.5 rounded-lg transition"
          title="Hear pronunciation"
        >
          🔊 Listen
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-1.5 rounded-lg transition"
          title="Save to vocabulary list"
        >
          💾 Save
        </button>
      </div>
    </div>
  );
};

export default DictionaryPopup;
