const { createClient } = require("@supabase/supabase-js");

let supabase = null;

function ensureSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is missing in environment variables.");
    }
    if (!supabaseSecretKey) {
      throw new Error("SUPABASE_SECRET_KEY is missing in environment variables.");
    }

    try {
      supabase = createClient(supabaseUrl, supabaseSecretKey);
    } catch (error) {
      throw new Error(`Supabase client could not be initialized: ${error.message}`);
    }
  }

  return supabase;
}

module.exports = new Proxy({}, {
  get(_target, prop) {
    const client = ensureSupabase();

    if (typeof client[prop] === "function") {
      return client[prop].bind(client);
    }

    return client[prop];
  },
});