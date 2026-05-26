const postsRoot = document.querySelector("[data-posts]");
const search = document.querySelector("[data-search]");
const refresh = document.querySelector("[data-refresh]");
let posts = [];

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function renderPosts() {
  const keyword = (search?.value || "").trim().toLowerCase();
  const visible = posts.filter((post) => {
    const haystack = [post.title, post.excerpt, post.tags].join(" ").toLowerCase();
    return !keyword || haystack.includes(keyword);
  });

  if (!visible.length) {
    postsRoot.innerHTML = '<p class="muted">没有匹配的文章。</p>';
    return;
  }

  postsRoot.innerHTML = visible.map((post) => {
    const tags = (post.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    return `
      <article class="post-card">
        <time datetime="${escapeHtml(post.created_at)}">${escapeHtml(new Date(post.created_at).toLocaleDateString("zh-CN"))}</time>
        <h2><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.excerpt || "")}</p>
        <div class="tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      </article>
    `;
  }).join("");
}

async function loadPosts() {
  postsRoot.innerHTML = '<p class="muted">正在读取文章...</p>';
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("读取失败");
    posts = await response.json();
    renderPosts();
  } catch {
    postsRoot.innerHTML = '<p class="muted">暂时无法读取后端文章。请确认 D1 已绑定并执行 schema.sql。</p>';
  }
}

search?.addEventListener("input", renderPosts);
refresh?.addEventListener("click", loadPosts);
loadPosts();
