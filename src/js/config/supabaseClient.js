// src/js/config/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'x';
const SUPABASE_KEY = 'x';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
