import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Vocara Side Panel
 *
 * A tab-based layout with:
 * - Vocabulary: saved words for the current session
 * - AI Tutor: chat interface placeholder
 * - Review: SRS flashcard review
 * - Stats: learning stats and streak
 */
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useVocabulary } from '../hooks/useVocabulary';
import '../content/styles.css';
const SidePanel = () => {
    const [activeTab, setActiveTab] = useState('vocabulary');
    return (_jsxs("div", { className: "flex flex-col h-full bg-gray-900 text-white font-sans", children: [_jsx("nav", { className: "flex border-b border-gray-700 shrink-0", children: ['vocabulary', 'tutor', 'review', 'stats'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `flex-1 py-3 text-xs font-medium uppercase tracking-wide transition ${activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-400'
                        : 'text-gray-400 hover:text-white'}`, children: tabLabel(tab) }, tab))) }), _jsxs("div", { className: "flex-1 overflow-y-auto", children: [activeTab === 'vocabulary' && _jsx(VocabularyTab, {}), activeTab === 'tutor' && _jsx(TutorTab, {}), activeTab === 'review' && _jsx(ReviewTab, {}), activeTab === 'stats' && _jsx(StatsTab, {})] })] }));
};
function tabLabel(tab) {
    const labels = {
        vocabulary: '📚 Vocab',
        tutor: '🤖 AI Tutor',
        review: '🃏 Review',
        stats: '📊 Stats',
    };
    return labels[tab];
}
// ── Vocabulary Tab ───────────────────────────────────────────────────────
const VocabularyTab = () => {
    const { vocabulary, deleteWord } = useVocabulary();
    const [search, setSearch] = useState('');
    const filtered = vocabulary.filter((v) => v.word.toLowerCase().includes(search.toLowerCase()) ||
        v.translation.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "p-3", children: [_jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search vocabulary\u2026", className: "w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500" }), filtered.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm text-center py-8", children: "No saved words yet." })) : (_jsx("ul", { className: "space-y-2", children: filtered.map((item) => (_jsxs("li", { className: "bg-gray-800 rounded-lg p-3 flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: item.word }), _jsx("p", { className: "text-sm text-yellow-300", children: item.translation }), item.contextSentence && (_jsx("p", { className: "text-xs text-gray-400 mt-1 italic", children: item.contextSentence }))] }), _jsx("button", { onClick: () => deleteWord(item.id), className: "text-gray-500 hover:text-red-400 text-lg ml-2", children: "\u00D7" })] }, item.id))) }))] }));
};
// ── AI Tutor Tab ─────────────────────────────────────────────────────────
const TutorTab = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', content: "Hi! I'm your AI language tutor. Ask me anything about the words or sentences you're learning." },
    ]);
    const handleSend = () => {
        if (!message.trim())
            return;
        setChat((prev) => [
            ...prev,
            { role: 'user', content: message },
            { role: 'assistant', content: 'TODO: Connect to /api/ai-tutor endpoint.' },
        ]);
        setMessage('');
    };
    return (_jsxs("div", { className: "flex flex-col h-full p-3", children: [_jsx("div", { className: "flex-1 space-y-2 overflow-y-auto mb-3", children: chat.map((msg, i) => (_jsx("div", { className: `rounded-lg p-3 text-sm max-w-xs ${msg.role === 'user'
                        ? 'bg-blue-600 ml-auto text-right'
                        : 'bg-gray-800 mr-auto'}`, children: msg.content }, i))) }), _jsxs("div", { className: "flex gap-2 shrink-0", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSend(), placeholder: "Ask your tutor\u2026", className: "flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" }), _jsx("button", { onClick: handleSend, className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition", children: "Send" })] })] }));
};
// ── Review Tab ────────────────────────────────────────────────────────────
const ReviewTab = () => {
    const { vocabulary } = useVocabulary();
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const dueCards = vocabulary.filter((v) => new Date(v.nextReviewAt) <= new Date());
    if (dueCards.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-gray-400", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83C\uDF89" }), _jsx("p", { className: "text-base", children: "No cards due for review!" })] }));
    }
    const card = dueCards[cardIndex % dueCards.length];
    return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [_jsxs("p", { className: "text-xs text-gray-400 mb-3", children: ["Card ", (cardIndex % dueCards.length) + 1, " / ", dueCards.length] }), _jsxs("div", { className: "w-full bg-gray-800 rounded-xl p-6 text-center cursor-pointer min-h-36 flex flex-col items-center justify-center border border-gray-700 hover:border-blue-500 transition mb-4", onClick: () => setFlipped((f) => !f), children: [flipped ? (_jsx("p", { className: "text-yellow-300 text-xl", children: card.translation })) : (_jsx("p", { className: "text-white text-2xl font-bold", children: card.word })), _jsx("p", { className: "text-xs text-gray-500 mt-3", children: flipped ? 'tap to flip back' : 'tap to reveal' })] }), flipped && (_jsx("div", { className: "grid grid-cols-4 gap-2 w-full", children: ['Again', 'Hard', 'Good', 'Easy'].map((grade) => (_jsx("button", { onClick: () => {
                        setCardIndex((i) => i + 1);
                        setFlipped(false);
                    }, className: `py-2 rounded-lg text-xs font-medium transition ${gradeColor(grade)}`, children: grade }, grade))) }))] }));
};
function gradeColor(grade) {
    const map = {
        Again: 'bg-red-600 hover:bg-red-500 text-white',
        Hard: 'bg-orange-500 hover:bg-orange-400 text-white',
        Good: 'bg-green-600 hover:bg-green-500 text-white',
        Easy: 'bg-blue-500 hover:bg-blue-400 text-white',
    };
    return map[grade];
}
// ── Stats Tab ─────────────────────────────────────────────────────────────
const StatsTab = () => {
    const { vocabulary } = useVocabulary();
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsx(StatRow, { icon: "\uD83D\uDCD6", label: "Words learned", value: vocabulary.length }), _jsx(StatRow, { icon: "\uD83D\uDD25", label: "Streak days", value: 0 }), _jsx(StatRow, { icon: "\u23F1\uFE0F", label: "Watch time (min)", value: 0 }), _jsx("div", { className: "bg-gray-800 rounded-xl p-4 text-center text-gray-500 text-sm", children: "\uD83D\uDCCA Charts coming soon" })] }));
};
const StatRow = ({ icon, label, value, }) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3", children: [_jsxs("span", { className: "text-base", children: [icon, " ", label] }), _jsx("span", { className: "text-xl font-bold text-blue-400", children: value })] }));
// Mount
const root = createRoot(document.getElementById('root'));
root.render(_jsx(SidePanel, {}));
