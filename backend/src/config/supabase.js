const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

let supabase = null;

if (supabaseUrl && supabaseSecretKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseSecretKey);
  } catch (error) {
    console.warn("Supabase client could not be initialized:", error.message);
  }
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase credentials are not configured");
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