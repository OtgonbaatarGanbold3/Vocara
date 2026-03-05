/**
 * GET /api/auth/callback
 *
 * OAuth callback handler placeholder for Supabase Auth.
 * Supabase handles the actual OAuth flow; this endpoint can be used
 * for additional post-auth logic (e.g., creating a user profile).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  // TODO: Implement OAuth callback logic if needed
  // Supabase's client-side SDK handles the token exchange automatically.
  res.status(200).json({ message: 'Auth callback received' });
}
