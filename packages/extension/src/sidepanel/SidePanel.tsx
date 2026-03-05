/**
 * Vocara Side Panel
 *
 * A tab-based layout with:
 * - Vocabulary: saved words for the current session
 * - AI Tutor: chat interface placeholder
 * - Review: SRS flashcard review
 * - Stats: learning stats and streak
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useVocabulary } from '../hooks/useVocabulary';
import '../content/styles.css';

type Tab = 'vocabulary' | 'tutor' | 'review' | 'stats';

const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('vocabulary');

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      {/* Tab bar */}
      <nav className="flex border-b border-gray-700 shrink-0">
        {(['vocabulary', 'tutor', 'review', 'stats'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-wide transition ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tabLabel(tab)}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'vocabulary' && <VocabularyTab />}
        {activeTab === 'tutor' && <TutorTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
    </div>
  );
};

function tabLabel(tab: Tab): string {
  const labels: Record<Tab, string> = {
    vocabulary: '📚 Vocab',
    tutor: '🤖 AI Tutor',
    review: '🃏 Review',
    stats: '📊 Stats',
  };
  return labels[tab];
}

// ── Vocabulary Tab ───────────────────────────────────────────────────────

const VocabularyTab: React.FC = () => {
  const { vocabulary, deleteWord } = useVocabulary();
  const [search, setSearch] = useState('');

  const filtered = vocabulary.filter(
    (v) =>
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vocabulary…"
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No saved words yet.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <li key={item.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-start">
              <div>
                <p className="font-semibold">{item.word}</p>
                <p className="text-sm text-yellow-300">{item.translation}</p>
                {item.contextSentence && (
                  <p className="text-xs text-gray-400 mt-1 italic">{item.contextSentence}</p>
                )}
              </div>
              <button
                onClick={() => deleteWord(item.id)}
                className="text-gray-500 hover:text-red-400 text-lg ml-2"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── AI Tutor Tab ─────────────────────────────────────────────────────────

const TutorTab: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI language tutor. Ask me anything about the words or sentences you're learning." },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat((prev) => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: 'TODO: Connect to /api/ai-tutor endpoint.' },
    ]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex-1 space-y-2 overflow-y-auto mb-3">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 text-sm max-w-xs ${
              msg.role === 'user'
                ? 'bg-blue-600 ml-auto text-right'
                : 'bg-gray-800 mr-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 shrink-0">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your tutor…"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// ── Review Tab ────────────────────────────────────────────────────────────

const ReviewTab: React.FC = () => {
  const { vocabulary } = useVocabulary();
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const dueCards = vocabulary.filter(
    (v) => new Date(v.nextReviewAt) <= new Date()
  );

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-base">No cards due for review!</p>
      </div>
    );
  }

  const card = dueCards[cardIndex % dueCards.length];

  return (
    <div className="p-4 flex flex-col items-center">
      <p className="text-xs text-gray-400 mb-3">
        Card {(cardIndex % dueCards.length) + 1} / {dueCards.length}
      </p>

      {/* Flashcard */}
      <div
        className="w-full bg-gray-800 rounded-xl p-6 text-center cursor-pointer min-h-36 flex flex-col items-center justify-center border border-gray-700 hover:border-blue-500 transition mb-4"
        onClick={() => setFlipped((f) => !f)}
      >
        {flipped ? (
          <p className="text-yellow-300 text-xl">{card.translation}</p>
        ) : (
          <p className="text-white text-2xl font-bold">{card.word}</p>
        )}
        <p className="text-xs text-gray-500 mt-3">{flipped ? 'tap to flip back' : 'tap to reveal'}</p>
      </div>

      {/* Grade buttons */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2 w-full">
          {(['Again', 'Hard', 'Good', 'Easy'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => {
                setCardIndex((i) => i + 1);
                setFlipped(false);
              }}
              className={`py-2 rounded-lg text-xs font-medium transition ${gradeColor(grade)}`}
            >
              {grade}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function gradeColor(grade: 'Again' | 'Hard' | 'Good' | 'Easy'): string {
  const map = {
    Again: 'bg-red-600 hover:bg-red-500 text-white',
    Hard: 'bg-orange-500 hover:bg-orange-400 text-white',
    Good: 'bg-green-600 hover:bg-green-500 text-white',
    Easy: 'bg-blue-500 hover:bg-blue-400 text-white',
  };
  return map[grade];
}

// ── Stats Tab ─────────────────────────────────────────────────────────────

const StatsTab: React.FC = () => {
  const { vocabulary } = useVocabulary();

  return (
    <div className="p-4 space-y-4">
      <StatRow icon="📖" label="Words learned" value={vocabulary.length} />
      <StatRow icon="🔥" label="Streak days" value={0} />
      <StatRow icon="⏱️" label="Watch time (min)" value={0} />

      <div className="bg-gray-800 rounded-xl p-4 text-center text-gray-500 text-sm">
        📊 Charts coming soon
      </div>
    </div>
  );
};

const StatRow: React.FC<{ icon: string; label: string; value: number }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
    <span className="text-base">
      {icon} {label}
    </span>
    <span className="text-xl font-bold text-blue-400">{value}</span>
  </div>
);

// Mount
const root = createRoot(document.getElementById('root')!);
root.render(<SidePanel />);
