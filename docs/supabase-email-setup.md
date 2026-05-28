# Supabase 邮箱确认配置指南

## 前端功能已添加

我们已经添加了完整的邮箱确认流程：
- ✅ 注册后显示友好的确认提示
- ✅ 专门的邮箱确认页面
- ✅ 确认成功后自动跳转

## 需要在 Supabase 后台配置

### 1. 配置 Site URL

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入你的项目 → **Authentication** → **URL Configuration**
3. 设置 **Site URL** 为你的应用地址：
   ```
   http://localhost:5173
   ```
   （开发环境）
   
   或生产环境地址，如：
   ```
   https://your-app.com
   ```

### 2. 配置 Redirect URLs

在 **Redirect URLs** 部分添加：
```
http://localhost:5173/email-confirm
https://your-app.com/email-confirm
```

### 3. 确认邮件设置（可选）

如果你想自定义确认邮件：
1. 进入 **Authentication** → **Email Templates**
2. 修改 **Confirm signup** 模板

### 4. 禁用邮箱确认（仅限开发环境）

如果想在开发环境跳过确认：
1. 进入 **Authentication** → **Users**
2. 找到用户 → 点击 **Confirm user**

或者在项目设置中调整：

## 测试流程

1. 启动应用：`npm run dev`
2. 访问 http://localhost:5173/auth
3. 点击"注册"标签
4. 填写邮箱和密码（至少6位）
5. 点击注册按钮
6. 应该看到确认提示
7. 检查邮箱，点击确认链接
8. 自动跳转到登录页面
9. 使用注册的邮箱密码登录

## 常见问题

### Q: 没有收到确认邮件？
A: 
- 检查垃圾邮件文件夹
- 确认 Supabase 后台的 Site URL 配置正确
- 确认邮箱没有被拦截

### Q: 确认链接打不开？
A: 
- 确保 Redirect URLs 包含你的应用地址
- 确保链接没有被邮件客户端截断

### Q: 想快速测试不想收邮件？
A: 
- 在 Supabase 后台手动点击 "Confirm user"
- 或禁用邮箱确认（不推荐用于生产环境）
