const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: body, error: e2 } = await supabase.from('bodies').select('id, name').ilike('name', '%Canon EOS R10%').limit(1).maybeSingle();
  console.log('Body with limit:', body, e2);
}
check();
