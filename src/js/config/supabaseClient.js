
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Metemos los datos a pelo y fuera líos
const SUPABASE_URL = 'https://qoyruiizcrabniplquoz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_6-m8-b7Cg7ylSQrhLb_HWg_epKFwcbi'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)