/**
 * ankiExport — Utility for generating Anki-importable decks from vocabulary.
 *
 * Generates a tab-separated (TSV) file that can be imported into Anki.
 * Fields: front (word), back (translation), context, tags
 */
/**
 * Generates the contents of an Anki-importable TSV file.
 *
 * Anki import format (tab-separated):
 * word\ttranslation\tcontext\taudio_placeholder\ttags
 *
 * @param words - Array of vocabulary items to export
 * @returns TSV string suitable for Anki import
 */
export function generateAnkiDeck(words) {
    const header = '#separator:tab\n#html:false\n#notetype:Basic\n#deck:Vocara\n';
    const rows = words.map((item) => {
        const front = sanitizeField(item.word);
        const back = sanitizeField(item.translation);
        const context = sanitizeField(item.contextSentence ?? '');
        // Placeholder for audio — actual audio URLs would require additional processing
        const audio = '';
        const tags = 'vocara';
        return [front, back, context, audio, tags].join('\t');
    });
    return header + rows.join('\n');
}
/**
 * Sanitizes a field value for TSV output by removing tab and newline characters.
 */
function sanitizeField(value) {
    return value.replace(/[\t\n\r]/g, ' ').trim();
}
