# ylpage

这个仓库现在拆成两个独立项目：

- `personal-page/`：二次元个人导航介绍页，纯静态，可直接部署 Cloudflare Pages。
- `blog/`：Cloudflare Pages Functions + D1 动态博客，有后端 API 和管理页。

预期部署域名：

- `https://ylmjc-personal.pages.dev`
- `https://ylmjc-blog.pages.dev`

## 重要说明

我已经在本地整理好两个项目，但当前机器没有 `wrangler`、`npm`、`npx`，因此无法在本机直接登录并部署到 Cloudflare。安装 Node.js 后，进入对应目录按各自 README 部署即可。
