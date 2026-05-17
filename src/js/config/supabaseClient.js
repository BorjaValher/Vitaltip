// src/js/config/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Reemplaza esto con los datos de tu proyecto Supabase
const SUPABASE_URL = 'https://qoyruiizcrabniplquoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveXJ1aWl6Y3JhYm5pcGxxdW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDkxNDEsImV4cCI6MjA5NDYyNTE0MX0.6vPoJUWWAWW9pOrhlq6kpkKb6Aka0wKtuNl_8KaPxH8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);