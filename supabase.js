const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment variables.');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_KEY in environment variables.');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;