import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vcefgpgmmwuazdyfqcst.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Tt7ZbkzkUb0AkGViB6o02w_xZ8qebh-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
