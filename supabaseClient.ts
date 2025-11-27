
import { createClient } from '@supabase/supabase-js'
import type { UserRole } from './types';

// --- Your Supabase Credentials ---
let supabaseUrl = 'https://efhlpuvvbacmmlvwazbs.supabase.co';
let supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaGxwdXZ2YmFjbW1sdndhemJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjIwNTYsImV4cCI6MjA3OTczODA1Nn0.BbLCudxOrPcCwCjIJhIWgSPyR0sRbcIuYtKBBFZsz0k';
// -------------------------------

if (!supabaseUrl) {
    console.error("Supabase URL is not configured. Please update supabaseClient.ts");
}
if (!supabaseAnonKey) {
    console.error("Supabase anon key is not configured. Please update supabaseClient.ts");
}

export let supabase = createClient(supabaseUrl, supabaseAnonKey);

export const setSupabaseCredentials = (url: string, anonKey: string) => {
    supabaseUrl = url;
    supabaseAnonKey = anonKey;
    supabase = createClient(url, anonKey);
};

// Define interfaces for Supabase table rows to get better type safety
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  specialty?: string;
  role: UserRole;
}