'use client';

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createBrowserClient = () =>
  createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
