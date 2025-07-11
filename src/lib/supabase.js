import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sehuiuzmmmrbgokhlhfl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlaHVpdXptbW1yYmdva2hsaGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg0MTgsImV4cCI6MjA2NzQ5NDQxOH0.DqhCo3_4psc1k5ZezL9AoM4nddFhcDy4rUp6QgPpqG8'

if (SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase