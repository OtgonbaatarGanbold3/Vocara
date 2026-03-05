import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * DictationMode — Dictation practice component.
 *
 * Hides the current subtitle, lets the user type what they hear,
 * then shows a diff of their answer vs. the correct text with a score.
 */
import { useState, useRef } from 'react';
/**
 * Produces a word-level diff between user input and the target sentence.
 */
function diffWords(input, target) {
    const inputWords = input.trim().toLowerCase().split(/\s+/);
    const targetWords = target.trim().toLowerCase().split(/\s+/);
    const maxLen = Math.max(inputWords.length, targetWords.length);
    const tokens = [];
    for (let i = 0; i < maxLen; i++) {
        const inp = inputWords[i];
        const tgt = targetWords[i];
        if (!tgt) {
            // Extra word typed by user (ignore gracefully)
            continue;
        }
        else if (!inp) {
            tokens.push({ text: tgt, type: 'missing' });
        }
        else if (inp === tgt) {
            tokens.push({ text: tgt, type: 'correct' });
        }
        else {
            tokens.push({ text: `${inp}→${tgt}`, type: 'wrong' });
        }
    }
    return tokens;
}
const DictationMode = ({ targetText, onClose }) => {
    const [userInput, setUserInput] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [diffTokens, setDiffTokens] = useState([]);
    const [score, setScore] = useState(0);
    const inputRef = useRef(null);
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
    const tokenColor = {
        correct: 'text-green-400',
        wrong: 'text-red-400 line-through',
        missing: 'text-yellow-400 underline',
    };
    return (_jsxs("div", { className: "bg-gray-900/95 text-white rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl border border-gray-700", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h2", { className: "text-lg font-bold", children: "\uD83D\uDCDD Dictation Mode" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white text-xl", children: "\u00D7" })] }), _jsx("p", { className: "text-sm text-gray-400 mb-3", children: "Type what you hear. The subtitle is hidden." }), !submitted ? (_jsxs(_Fragment, { children: [_jsx("textarea", { ref: inputRef, value: userInput, onChange: (e) => setUserInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(), placeholder: "Type the sentence here\u2026", rows: 3, className: "w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 mb-3", autoFocus: true }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleSubmit, className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium", children: "Check \u2713" }), _jsx("button", { onClick: onClose, className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition", children: "Skip" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-gray-800 rounded-lg p-3 mb-3 text-base leading-relaxed", children: diffTokens.map((token, i) => (_jsx("span", { className: `${tokenColor[token.type]} mr-1`, children: token.text }, i))) }), _jsxs("p", { className: `text-2xl font-bold mb-4 ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`, children: ["Score: ", score, "%"] }), _jsxs("div", { className: "text-sm text-gray-400 mb-4", children: [_jsx("span", { className: "font-semibold text-white", children: "Correct: " }), targetText] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleRetry, className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition", children: "\uD83D\uDD04 Retry" }), _jsx("button", { onClick: onClose, className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition", children: "Done" })] })] }))] }));
};
export default DictationMode;
