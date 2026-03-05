/**
 * POST /api/ai-tutor
 *
 * Sends a message to the AI language tutor powered by OpenAI.
 *
 * Request body:
 * ```json
 * { "message": "What does 'serendipity' mean?", "context": "...", "conversationHistory": [...] }
 * ```
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

interface TutorRequest {
  message: string;
  context?: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

const SYSTEM_PROMPT = `You are a friendly and encouraging language tutor. 
Help the user understand vocabulary, grammar, and pronunciation. 
Give concise, clear explanations with examples. 
When explaining words, include etymology when interesting.
Encourage the learner and celebrate their progress.`;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { message, context, conversationHistory = [] } = req.body as TutorRequest;

  if (!message) {
    res.status(400).json({ error: 'Missing required field: message' });
    return;
  }

  const apiKey = process.env['OPENAI_API_KEY'];
  if (!apiKey) {
    res.status(503).json({ error: 'AI Tutor service not configured' });
    return;
  }

  try {
    const openai = new OpenAI({ apiKey });

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context from the video: "${context}"\n\nUser question: ${message}`,
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content ?? '';

    res.status(200).json({ response });
  } catch (err) {
    console.error('[ai-tutor]', err);
    res.status(500).json({ error: 'AI Tutor request failed' });
  }
}
