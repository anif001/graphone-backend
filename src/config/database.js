const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  if (!config.supabase.url) {
    const ApiError = require('../utils/ApiError');
    throw new ApiError(500, 'Supabase URL not configured. Set SUPABASE_URL in .env');
  }
  supabase = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey || config.supabase.anonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  return supabase;
}

module.exports = getSupabase;
