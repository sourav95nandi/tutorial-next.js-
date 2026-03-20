import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const cookieMethods = {
  getAll: async () => {
    const cookieStore = await cookies();
    return cookieStore.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value }));
  },
  setAll: async (newCookies: { name: string; value: string; options: any }[]) => {
    const cookieStore = await cookies();
    newCookies.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options as any);
    });
  },
};

export const createServerClient = () =>
  createSupabaseServerClient(supabaseUrl, supabaseKey, {
    cookies: cookieMethods,
  });
