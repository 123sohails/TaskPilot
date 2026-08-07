const { createClient } = require("@supabase/supabase-js");

let supabase = null;

function ensureSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error("Supabase credentials are not configured");
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