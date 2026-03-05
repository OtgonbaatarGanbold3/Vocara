/**
 * DictationMode — Dictation practice component.
 *
 * Hides the current subtitle, lets the user type what they hear,
 * then shows a diff of their answer vs. the correct text with a score.
 */

import React, { useState, useRef } from 'react';

interface Props {
  targetText: string;
  onClose: () => void;
}

interface DiffToken {
  text: string;
  type: 'correct' | 'wrong' | 'missing';
}

/**
 * Produces a word-level diff between user input and the target sentence.
 */
function diffWords(input: string, target: string): DiffToken[] {
  const inputWords = input.trim().toLowerCase().split(/\s+/);
  const targetWords = target.trim().toLowerCase().split(/\s+/);
  const maxLen = Math.max(inputWords.length, targetWords.length);

  const tokens: DiffToken[] = [];
  for (let i = 0; i < maxLen; i++) {
    const inp = inputWords[i];
    const tgt = targetWords[i];

    if (!tgt) {
      // Extra word typed by user (ignore gracefully)
      continue;
    } else if (!inp) {
      tokens.push({ text: tgt, type: 'missing' });
    } else if (inp === tgt) {
      tokens.push({ text: tgt, type: 'correct' });
    } else {
      tokens.push({ text: `${inp}→${tgt}`, type: 'wrong' });
    }
  }
  return tokens;
}

const DictationMode: React.FC<Props> = ({ targetText, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [diffTokens, setDiffTokens] = useState<DiffToken[]>([]);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const tokens = diffWords(userInput, targetText);
    const correct = tokens.filter((t) => t.type === 'correct').length;
    const total = targetText.trim().split(/\s+/).length;
    setDiffTokens(tokens);
    setScore(Math.round((correct / Math.max(total, 1)) * 100));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserInput('');
    setSubmitted(false);
    setDiffTokens([]);
    setScore(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const tokenColor: Record<DiffToken['type'], string> = {
    correct: 'text-green-400',
    wrong: 'text-red-400 line-through',
    missing: 'text-yellow-400 underline',
  };

  return (
    <div className="bg-gray-900/95 text-white rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">📝 Dictation Mode</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
          ×
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-3">Type what you hear. The subtitle is hidden.</p>

      {!submitted ? (
        <>
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            placeholder="Type the sentence here…"
            rows={3}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium"
            >
              Check ✓
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
            >
              Skip
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Diff display */}
          <div className="bg-gray-800 rounded-lg p-3 mb-3 text-base leading-relaxed">
            {diffTokens.map((token, i) => (
              <span key={i} className={`${tokenColor[token.type]} mr-1`}>
                {token.text}
              </span>
            ))}
          </div>

          {/* Score */}
          <p
            className={`text-2xl font-bold mb-4 ${
              score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            Score: {score}%
          </p>

          {/* Original answer */}
          <div className="text-sm text-gray-400 mb-4">
            <span className="font-semibold text-white">Correct: </span>
            {targetText}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition"
            >
              🔄 Retry
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DictationMode;
