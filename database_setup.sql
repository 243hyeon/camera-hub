-- 1. 뉴스 스크랩을 저장할 창고 만들기
CREATE TABLE saved_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AI 답변을 저장할 창고 만들기
CREATE TABLE saved_ai_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 유저들이 자기 데이터만 보고 지울 수 있도록 보안 규칙(RLS) 설정하기
ALTER TABLE saved_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ai_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved news" ON saved_news FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved news" ON saved_news FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved news" ON saved_news FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved ai chats" ON saved_ai_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved ai chats" ON saved_ai_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved ai chats" ON saved_ai_chats FOR DELETE USING (auth.uid() = user_id);
