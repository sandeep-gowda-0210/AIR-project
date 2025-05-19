import { createClient } from '@supabase/supabase-js';

const supabase = await createClient(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
    `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
);

export default supabase;