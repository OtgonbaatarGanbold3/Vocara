/**
 * supabaseClient — Supabase browser client initialization.
 *
 * Uses environment variables injected by Vite.
 * Import this client wherever you need database or auth access.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Vocara] Supabase env vars not set. Auth and sync features will be disabled.');
}

/** Typed Supabase browser client */
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
