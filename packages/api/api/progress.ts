/**
 * /api/progress
 *
 * GET  — return user learning stats
 * POST — log a new watch session
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

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

  if (req.method === 'GET') {
    return handleGet(res, userId);
  }

  if (req.method === 'POST') {
    return handlePost(req, res, userId);
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

/** GET /api/progress — aggregate user stats */
async function handleGet(res: VercelResponse, userId: string): Promise<void> {
  const [vocabRes, sessionsRes, profileRes] = await Promise.all([
    supabase
      .from('vocabulary')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('watch_sessions')
      .select('duration_seconds, words_looked_up, words_saved')
      .eq('user_id', userId),
    supabase.from('profiles').select('streak_days').eq('id', userId).single(),
  ]);

  const wordsLearned = vocabRes.count ?? 0;

  const totalSeconds = (sessionsRes.data ?? []).reduce(
    (acc, s) => acc + (s.duration_seconds ?? 0),
    0
  );
  const totalWordsLookedUp = (sessionsRes.data ?? []).reduce(
    (acc, s) => acc + (s.words_looked_up ?? 0),
    0
  );

  res.status(200).json({
    wordsLearned,
    watchTimeMinutes: Math.round(totalSeconds / 60),
    wordsLookedUp: totalWordsLookedUp,
    streakDays: profileRes.data?.streak_days ?? 0,
  });
}

/** POST /api/progress — log a watch session */
async function handlePost(
  req: VercelRequest,
  res: VercelResponse,
  userId: string
): Promise<void> {
  const { platform, contentTitle, contentUrl, language, durationSeconds, wordsLookedUp, wordsSaved } =
    req.body as {
      platform: string;
      contentTitle: string;
      contentUrl?: string;
      language: string;
      durationSeconds: number;
      wordsLookedUp: number;
      wordsSaved: number;
    };

  const { data, error } = await supabase
    .from('watch_sessions')
    .insert({
      user_id: userId,
      platform,
      content_title: contentTitle,
      content_url: contentUrl,
      language,
      duration_seconds: durationSeconds,
      words_looked_up: wordsLookedUp,
      words_saved: wordsSaved,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
}
