import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const hasValidCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here';

if (!hasValidCredentials) {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('⚠️  SUPABASE CONFIGURATION ERROR');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  console.error('Missing or invalid Supabase credentials in .env file!');
  console.error('');
  console.error('Current values:');
  console.error(`  VITE_SUPABASE_URL: ${supabaseUrl || '(not set)'}`);
  console.error(`  VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '(set but may be placeholder)' : '(not set)'}`);
  console.error('');
  console.error('To fix this:');
  console.error('  1. Open your .env file');
  console.error('  2. Replace placeholder values with your actual Supabase project credentials');
  console.error('  3. Get credentials from: https://app.supabase.com/project/_/settings/api');
  console.error('  4. Restart your dev server (Ctrl+C and npm run dev)');
  console.error('');
  console.error('Features that will NOT work without valid credentials:');
  console.error('  ❌ Login/Authentication');
  console.error('  ❌ Saving scans to database');
  console.error('  ✅ OpenAI graph generation (works independently)');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Create Supabase client (will work for public operations but fail for authenticated ones)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Auth helper functions
export const auth = {
  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
