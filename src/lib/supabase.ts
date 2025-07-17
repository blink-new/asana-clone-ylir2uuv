import { createClient } from '@supabase/supabase-js'
import { blink } from '@/blink/client'

const supabaseUrl = 'https://rnxowvaxpvlytogridzw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueG93dmF4cHZseXRvZ3JpZHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDE1NTgsImV4cCI6MjA2ODMxNzU1OH0.R86PgosgOuOFI0oNiOtEEGRzXQAi0d5-eE8UFj3F2vA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

// Function to set the auth token from Blink
export const setSupabaseAuth = (token: string) => {
  supabase.auth.setSession({
    access_token: token,
    refresh_token: '',
    expires_in: 3600,
    token_type: 'bearer',
    user: null
  })
}