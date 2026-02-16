import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 이 'supabase' 변수를 통해 앞으로 데이터를 불러오거나 추가할 수 있습니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
