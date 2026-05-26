CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  content TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO posts (title, slug, excerpt, tags, content, published, created_at, updated_at)
VALUES
(
  '第一篇博客：动态博客上线',
  'hello-d1-blog',
  '这篇文章来自 Cloudflare D1 数据库，通过 Pages Functions API 读取。',
  'Cloudflare,D1,博客',
  '# 第一篇博客：动态博客上线

这个博客不是纯静态页面。文章会保存到 Cloudflare D1 数据库，前端通过 `/api/posts` 和 `/api/posts/:slug` 读取。

你可以进入 `admin.html`，输入 Cloudflare 环境变量里设置的 `ADMIN_TOKEN` 来发布或更新文章。

## 后续计划

- 加文章分类
- 加草稿状态
- 加上传封面图
- 加评论或友链',
  1,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO NOTHING;
