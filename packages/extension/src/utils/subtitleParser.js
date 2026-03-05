/**
 * subtitleParser — Utilities for parsing SRT, VTT, and TTML subtitle formats.
 */
/**
 * Converts a timestamp string (HH:MM:SS,mmm or HH:MM:SS.mmm) to milliseconds.
 */
function timestampToMs(ts) {
    const cleaned = ts.replace(',', '.');
    const parts = cleaned.split(':');
    const hours = Number(parts[0]) * 3600000;
    const minutes = Number(parts[1]) * 60000;
    const seconds = parseFloat(parts[2] ?? '0') * 1000;
    return Math.round(hours + minutes + seconds);
}
/**
 * Strips HTML/XML tags from a string by iteratively applying the tag regex
 * until no tags remain, preventing nested-tag bypass attacks.
 */
function stripTags(input) {
    let result = input;
    let prev;
    do {
        prev = result;
        result = result.replace(/<[^>]*>/g, '');
    } while (result !== prev);
    return result;
}
/**
 * Formats a millisecond duration as HH:MM:SS.mmm
 */
export function formatTimestamp(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const mil = ms % 1000;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(mil).padStart(3, '0')}`;
}
/**
 * Parses an SRT subtitle file into an array of Subtitle objects.
 *
 * SRT format:
 * ```
 * 1
 * 00:00:01,000 --> 00:00:04,000
 * Hello world
 * ```
 */
export function parseSRT(content) {
    const subtitles = [];
    const blocks = content.trim().split(/\n\s*\n/);
    for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length < 3)
            continue;
        const id = lines[0].trim();
        const timeLine = lines[1].trim();
        const textLines = lines.slice(2);
        const timeParts = timeLine.split(' --> ');
        if (timeParts.length !== 2)
            continue;
        subtitles.push({
            id,
            startTime: timestampToMs(timeParts[0].trim()),
            endTime: timestampToMs(timeParts[1].trim()),
            text: stripTags(textLines.join(' ')).trim(),
        });
    }
    return subtitles;
}
/**
 * Parses a WebVTT subtitle file into an array of Subtitle objects.
 *
 * VTT format is similar to SRT but uses `.` instead of `,` for milliseconds
 * and starts with a "WEBVTT" header.
 */
export function parseVTT(content) {
    const lines = content.split('\n');
    const subtitles = [];
    let i = 0;
    // Skip header
    while (i < lines.length && !lines[i].includes('-->'))
        i++;
    while (i < lines.length) {
        const timeLine = lines[i].trim();
        if (!timeLine.includes('-->')) {
            i++;
            continue;
        }
        const timeParts = timeLine.split('-->');
        const startTime = timestampToMs(timeParts[0].trim());
        const endTime = timestampToMs(timeParts[1].trim().split(' ')[0]);
        i++;
        const textLines = [];
        while (i < lines.length && lines[i].trim() !== '') {
            textLines.push(lines[i].trim());
            i++;
        }
        if (textLines.length > 0) {
            subtitles.push({
                id: String(subtitles.length + 1),
                startTime,
                endTime,
                text: stripTags(textLines.join(' ')).trim(),
            });
        }
        i++;
    }
    return subtitles;
}
/**
 * Parses a TTML (Timed Text Markup Language) subtitle file.
 * Used by Netflix and Disney+.
 */
export function parseTTML(content) {
    const subtitles = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'application/xml');
    const paragraphs = doc.querySelectorAll('p');
    let idCounter = 1;
    paragraphs.forEach((p) => {
        const begin = p.getAttribute('begin') ?? '00:00:00.000';
        const end = p.getAttribute('end') ?? '00:00:00.000';
        const text = p.textContent?.trim() ?? '';
        if (text) {
            subtitles.push({
                id: String(idCounter++),
                startTime: timestampToMs(begin),
                endTime: timestampToMs(end),
                text,
            });
        }
    });
    return subtitles;
}
