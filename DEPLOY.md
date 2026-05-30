# 灵感花园 - Nginx 部署指南

## 前置准备

- 云服务器（Ubuntu/Debian 推荐）
- 域名 `www.playwork.top` 已解析到服务器 IP
- SSH 访问权限

---

## 步骤一：服务器环境配置

### 1. SSH 登录服务器
```bash
ssh root@你的服务器IP
```

### 2. 安装 Nginx
```bash
# Ubuntu/Debian
apt update && apt install -y nginx

# CentOS/RHEL
yum install -y nginx
systemctl enable nginx
```

### 3. 安装 Node.js（用于后续更新）
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## 步骤二：上传构建文件

### 方法A：使用 scp（推荐）
```bash
# 在本地机器执行
scp -r /workspace/dist/* root@你的服务器IP:/var/www/inspiration/
```

### 方法B：使用 rsync
```bash
rsync -avz /workspace/dist/ root@你的服务器IP:/var/www/inspiration/
```

### 方法C：在服务器上直接拉取
```bash
# SSH 登录服务器后执行
mkdir -p /var/www/inspiration
cd /var/www/inspiration
git clone https://github.com/wang651852460/inspiration.git
cd inspiration
npm install
npm run build
```

---

## 步骤三：配置 Nginx

### 1. 创建配置文件
在服务器上执行：
```bash
cat > /etc/nginx/sites-available/inspiration << 'EOF'
server {
    listen 80;
    server_name www.playwork.top;

    root /var/www/inspiration/dist;
    index index.html;

    # SPA 路由支持 - 所有请求都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁用 HTML 缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/xml;
    gzip_disable "MSIE [1-6]\.";

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF
```

### 2. 启用配置
```bash
# 创建软链接
ln -s /etc/nginx/sites-available/inspiration /etc/nginx/sites-enabled/

# 删除默认配置（可选）
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

---

## 步骤四：配置 HTTPS（强烈推荐）

使用 Certbot 免费申请 Let's Encrypt 证书：

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 自动配置 HTTPS
certbot --nginx -d www.playwork.top

# 按照提示输入邮箱，同意条款
```

Certbot 会自动修改 Nginx 配置并设置自动续期。

---

## 步骤五：验证部署

1. 浏览器访问 `http://www.playwork.top`（或 `https://www.playwork.top`）
2. 应该能看到"灵感花园"的登录页面
3. 测试登录功能是否正常

---

## 后续更新

### 方法A：重新构建上传
```bash
# 本地执行
cd /workspace
npm run build
rsync -avz ./dist/ root@你的服务器IP:/var/www/inspiration/dist/
```

### 方法B：服务器直接拉取
```bash
# SSH 登录服务器
ssh root@你的服务器IP
cd /var/www/inspiration
git pull
npm install
npm run build
```

---

## 常见问题

### Q: 访问域名显示 404？
A: 检查 Nginx 配置的 `root` 路径是否正确指向 `dist` 目录

### Q: 刷新页面出现 404？
A: 确保 `location /` 中有 `try_files $uri $uri/ /index.html;`

### Q: 静态资源加载慢？
A: 已配置 gzip 压缩和浏览器缓存，如果还是慢可以检查服务器带宽

### Q: 如何查看 Nginx 日志？
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```
