# 樱落满尽城动态博客

这是独立博客项目，使用 Cloudflare Pages Functions + D1。

## 功能

- `/api/posts`：读取文章列表，发布/更新文章
- `/api/posts/:slug`：读取单篇文章，软删除文章
- `public/index.html`：博客列表
- `public/post.html`：文章详情
- `public/admin.html`：发布文章管理页
- `schema.sql`：D1 表结构和初始文章

## 部署到 Cloudflare

需要本机有 Node/npm 和 Wrangler，并且已登录 Cloudflare。

```bash
npm install
npx wrangler pages project create ylmjc-blog --production-branch main
npx wrangler d1 create ylmjc-blog-db
```

把上一步输出的 `database_id` 填入 `wrangler.jsonc`。

```bash
npx wrangler d1 execute ylmjc-blog-db --remote --file ./schema.sql
npx wrangler pages secret put ADMIN_TOKEN --project-name ylmjc-blog
npx wrangler pages deploy public --project-name ylmjc-blog
```

如果用 Cloudflare Dashboard 部署：

- Framework preset: `None`
- Build command: 留空
- Build output directory: `public`
- Functions directory: `functions`
- D1 binding: `DB`
- 环境变量：`ADMIN_TOKEN`
