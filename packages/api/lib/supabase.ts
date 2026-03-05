/**
 * Supabase server-side client (for use inside Vercel serverless functions).
 *
 * Uses the service-role key for elevated privileges when acting on behalf
 * of authenticated users after JWT verification.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Vocara API] Supabase environment variables are not set.');
}

/** Service-role Supabase client for server-side operations */
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
