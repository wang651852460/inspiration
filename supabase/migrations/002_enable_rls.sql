-- 灵感应用数据库权限设置

-- 1. 启用行级安全策略 (Row Level Security)
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;

-- 2. 创建策略：允许已认证用户读取自己的数据
CREATE POLICY "Users can read their own data" 
ON public.inspirations
FOR SELECT
USING (auth.uid() = user_id);

-- 3. 创建策略：允许已认证用户插入自己的数据
CREATE POLICY "Users can insert their own data"
ON public.inspirations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. 创建策略：允许已认证用户更新自己的数据
CREATE POLICY "Users can update their own data"
ON public.inspirations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. 创建策略：允许已认证用户删除自己的数据
CREATE POLICY "Users can delete their own data"
ON public.inspirations
FOR DELETE
USING (auth.uid() = user_id);
