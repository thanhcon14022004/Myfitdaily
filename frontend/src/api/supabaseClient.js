import { createClient } from '@supabase/supabase-js';

const AUTHENTIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNld2RheWdhc2l3amZqbGdtbnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTUyNjYsImV4cCI6MjEwNDYzMTI2Nn0.MWvmxi-KzFgWlQ5r-rf8SJEPYwlldI9cckgulB1Kbl8';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cewdaygasiwjfjlgmnwn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || AUTHENTIC_ANON_KEY;

export const isSupabaseConfigured = () => true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
