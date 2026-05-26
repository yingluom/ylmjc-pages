const root = document.querySelector("[data-article]");
const params = new URLSearchParams(location.search);
const slug = params.get("slug");

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function markdownToHtml(markdown = "") {
  return escapeHtml(markdown)
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .split(/\n{2,}/)
    .map((block) => /^<h[1-3]/.test(block) ? block : `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

async function loadPost() {
  if (!slug) {
    root.innerHTML = '<p class="muted">缺少文章 slug。</p>';
    return;
  }

  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error("文章不存在");
    const post = await response.json();
    document.title = `${post.title} | 樱落满尽城`;
    root.innerHTML = `
      <article class="article">
        <a href="./" class="muted">返回列表</a>
        <p class="article-meta">${escapeHtml(new Date(post.created_at).toLocaleDateString("zh-CN"))}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="muted">${escapeHtml(post.excerpt || "")}</p>
        <div class="article-content">${markdownToHtml(post.content || "")}</div>
      </article>
    `;
  } catch {
    root.innerHTML = '<p class="muted">没有找到这篇文章。</p>';
  }
}

loadPost();
