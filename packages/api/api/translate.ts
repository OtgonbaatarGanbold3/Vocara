/**
 * POST /api/translate
 *
 * Translates a word or phrase using the DeepL API.
 *
 * Request body:
 * ```json
 * { "text": "hello", "sourceLang": "en", "targetLang": "es", "type": "word" | "phrase" }
 * ```
 *
 * Response:
 * ```json
 * { "translation": "hola", "partOfSpeech": "interjection", "detectedLanguage": "EN" }
 * ```
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  type: 'word' | 'phrase';
}

interface DeepLTranslation {
  detected_source_language: string;
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { text, sourceLang, targetLang } = req.body as TranslateRequest;

  if (!text || !targetLang) {
    res.status(400).json({ error: 'Missing required fields: text, targetLang' });
    return;
  }

  const apiKey = process.env['DEEPL_API_KEY'];
  if (!apiKey) {
    res.status(503).json({ error: 'Translation service not configured' });
    return;
  }

  try {
    const params = new URLSearchParams({
      auth_key: apiKey,
      text,
      target_lang: targetLang.toUpperCase(),
    });

    if (sourceLang && sourceLang !== 'auto') {
      params.set('source_lang', sourceLang.toUpperCase());
    }

    const deepLRes = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!deepLRes.ok) {
      throw new Error(`DeepL API error: ${deepLRes.status}`);
    }

    const data = (await deepLRes.json()) as DeepLResponse;
    const translation = data.translations[0];

    res.status(200).json({
      translation: translation.text,
      detectedLanguage: translation.detected_source_language,
    });
  } catch (err) {
    console.error('[translate]', err);
    res.status(500).json({ error: 'Translation failed' });
  }
}
