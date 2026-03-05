/**
 * ShadowingMode — Shadowing practice component.
 *
 * Records the user's voice via the Web Speech API,
 * compares their pronunciation against the current subtitle,
 * and provides visual score feedback.
 */

import React, { useState, useCallback } from 'react';

interface Props {
  targetText: string;
  onClose: () => void;
}

type RecordingState = 'idle' | 'recording' | 'done';

const ShadowingMode: React.FC<Props> = ({ targetText, onClose }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recognizedText, setRecognizedText] = useState('');
  const [score, setScore] = useState<number | null>(null);

  /**
   * Calculates a simple similarity score between two strings (0–100).
   * Uses a word-overlap heuristic as a placeholder for a proper phonetic scorer.
   */
  const calculateScore = (recognized: string, target: string): number => {
    const rec = recognized.toLowerCase().split(/\s+/);
    const tgt = target.toLowerCase().split(/\s+/);
    const matches = rec.filter((w) => tgt.includes(w)).length;
    return Math.round((matches / Math.max(tgt.length, 1)) * 100);
  };

  /** Start recording using the Web Speech Recognition API */
  const handleRecord = useCallback(() => {
    // Check for browser support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition })
        .SpeechRecognition ??
      (
        window as unknown as {
          webkitSpeechRecognition?: typeof window.SpeechRecognition;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecordingState('recording');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      setScore(calculateScore(transcript, targetText));
      setRecordingState('done');
    };

    recognition.onerror = () => setRecordingState('idle');
    recognition.start();
  }, [targetText]);

  const handleRetry = () => {
    setRecordingState('idle');
    setRecognizedText('');
    setScore(null);
  };

  const scoreColor =
    score === null ? '' : score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-gray-900/95 text-white rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">🎤 Shadowing Mode</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
          ×
        </button>
      </div>

      {/* Target sentence */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4 text-base leading-relaxed">{targetText}</div>

      {/* Recording state */}
      {recordingState === 'recording' && (
        <div className="flex items-center gap-2 text-red-400 animate-pulse mb-3">
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
          Recording… speak the sentence above
        </div>
      )}

      {/* Result */}
      {recordingState === 'done' && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Your speech:</p>
          <p className="text-base">{recognizedText}</p>
          {score !== null && (
            <p className={`text-2xl font-bold mt-2 ${scoreColor}`}>Score: {score}%</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {recordingState !== 'recording' && (
          <button
            onClick={recordingState === 'done' ? handleRetry : handleRecord}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium"
          >
            {recordingState === 'done' ? '🔄 Retry' : '🎤 Start Recording'}
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default ShadowingMode;
