import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ShadowingMode — Shadowing practice component.
 *
 * Records the user's voice via the Web Speech API,
 * compares their pronunciation against the current subtitle,
 * and provides visual score feedback.
 */
import { useState, useCallback } from 'react';
const ShadowingMode = ({ targetText, onClose }) => {
    const [recordingState, setRecordingState] = useState('idle');
    const [recognizedText, setRecognizedText] = useState('');
    const [score, setScore] = useState(null);
    /**
     * Calculates a simple similarity score between two strings (0–100).
     * Uses a word-overlap heuristic as a placeholder for a proper phonetic scorer.
     */
    const calculateScore = (recognized, target) => {
        const rec = recognized.toLowerCase().split(/\s+/);
        const tgt = target.toLowerCase().split(/\s+/);
        const matches = rec.filter((w) => tgt.includes(w)).length;
        return Math.round((matches / Math.max(tgt.length, 1)) * 100);
    };
    /** Start recording using the Web Speech Recognition API */
    const handleRecord = useCallback(() => {
        // Check for browser support (standard or webkit-prefixed)
        const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setRecordingState('recording');
        recognition.onresult = (event) => {
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
    const scoreColor = score === null ? '' : score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
    return (_jsxs("div", { className: "bg-gray-900/95 text-white rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl border border-gray-700", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h2", { className: "text-lg font-bold", children: "\uD83C\uDFA4 Shadowing Mode" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white text-xl", children: "\u00D7" })] }), _jsx("div", { className: "bg-gray-800 rounded-lg p-3 mb-4 text-base leading-relaxed", children: targetText }), recordingState === 'recording' && (_jsxs("div", { className: "flex items-center gap-2 text-red-400 animate-pulse mb-3", children: [_jsx("span", { className: "w-3 h-3 bg-red-500 rounded-full inline-block" }), "Recording\u2026 speak the sentence above"] })), recordingState === 'done' && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-gray-400 mb-1", children: "Your speech:" }), _jsx("p", { className: "text-base", children: recognizedText }), score !== null && (_jsxs("p", { className: `text-2xl font-bold mt-2 ${scoreColor}`, children: ["Score: ", score, "%"] }))] })), _jsxs("div", { className: "flex gap-2", children: [recordingState !== 'recording' && (_jsx("button", { onClick: recordingState === 'done' ? handleRetry : handleRecord, className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium", children: recordingState === 'done' ? '🔄 Retry' : '🎤 Start Recording' })), _jsx("button", { onClick: onClose, className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition", children: "Skip" })] })] }));
};
export default ShadowingMode;
