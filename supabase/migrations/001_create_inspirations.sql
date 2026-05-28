-- 创建灵感表
CREATE TABLE IF NOT EXISTS inspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  color TEXT DEFAULT '#FF6B35',
  drawing TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_inspirations_user_id ON inspirations(user_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_created_at ON inspirations(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能看到自己的灵感
CREATE POLICY "Users can view own inspirations" ON inspirations
  FOR SELECT USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的灵感
CREATE POLICY "Users can insert own inspirations" ON inspirations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能更新自己的灵感
CREATE POLICY "Users can update own inspirations" ON inspirations
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的灵感
CREATE POLICY "Users can delete own inspirations" ON inspirations
  FOR DELETE USING (auth.uid() = user_id);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_inspirations_updated_at
  BEFORE UPDATE ON inspirations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
