/**
 * /api/vocabulary
 *
 * CRUD endpoints for user vocabulary items.
 * All operations require a valid Supabase JWT.
 *
 * GET    — fetch paginated vocabulary
 * POST   — save a new vocabulary item
 * PUT    — update review status / SRS data
 * DELETE — remove a vocabulary item
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

/** Verifies the incoming JWT and returns the user's ID, or null if invalid. */
async function getUserId(req: VercelRequest): Promise<string | null> {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, userId);
    case 'POST':
      return handlePost(req, res, userId);
    case 'PUT':
      return handlePut(req, res, userId);
    case 'DELETE':
      return handleDelete(req, res, userId);
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

/** GET /api/vocabulary?page=1&limit=50 */
async function handleGet(req: VercelRequest, res: VercelResponse, userId: string): Promise<void> {
  const page = Number(req.query['page'] ?? 1);
  const limit = Math.min(Number(req.query['limit'] ?? 50), 100);
  const from = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('vocabulary')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ data, total: count, page, limit });
}

/** POST /api/vocabulary */
async function handlePost(req: VercelRequest, res: VercelResponse, userId: string): Promise<void> {
  const { word, translation, contextSentence, sourceUrl, sourceTitle, partOfSpeech } = req.body as {
    word: string;
    translation: string;
    contextSentence?: string;
    sourceUrl?: string;
    sourceTitle?: string;
    partOfSpeech?: string;
  };

  if (!word || !translation) {
    res.status(400).json({ error: 'word and translation are required' });
    return;
  }

  const { data, error } = await supabase
    .from('vocabulary')
    .insert({
      user_id: userId,
      word,
      translation,
      context_sentence: contextSentence,
      source_url: sourceUrl,
      source_title: sourceTitle,
      part_of_speech: partOfSpeech,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
}

/** PUT /api/vocabulary */
async function handlePut(req: VercelRequest, res: VercelResponse, userId: string): Promise<void> {
  const { id, nextReviewAt, easeFactor, reviewCount } = req.body as {
    id: string;
    nextReviewAt?: string;
    easeFactor?: number;
    reviewCount?: number;
  };

  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }

  const { data, error } = await supabase
    .from('vocabulary')
    .update({
      next_review_at: nextReviewAt,
      ease_factor: easeFactor,
      review_count: reviewCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}

/** DELETE /api/vocabulary?id=<uuid> */
async function handleDelete(
  req: VercelRequest,
  res: VercelResponse,
  userId: string
): Promise<void> {
  const id = req.query['id'] as string | undefined;
  if (!id) {
    res.status(400).json({ error: 'id query param is required' });
    return;
  }

  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).end();
}
