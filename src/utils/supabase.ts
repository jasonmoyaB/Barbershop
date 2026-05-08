import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl,
  keyPrefix: supabaseKey?.substring(0, 20) + '...',
  keyLength: supabaseKey?.length,
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!', { supabaseUrl, supabaseKey });
  throw new Error('Supabase URL or Key is missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
