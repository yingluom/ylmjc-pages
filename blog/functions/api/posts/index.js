function json(data, init = {}) {
  return Response.json(data, {
    headers: { "cache-control": "no-store" },
    ...init
  });
}

function assertAdmin(request, env) {
  const configured = env.ADMIN_TOKEN;
  const provided = request.headers.get("x-admin-token");

  if (!configured) {
    return "Cloudflare 环境变量 ADMIN_TOKEN 还没有设置。";
  }

  if (!provided || provided !== configured) {
    return "管理密钥不正确。";
  }

  return null;
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, slug, excerpt, tags, created_at, updated_at
     FROM posts
     WHERE published = 1
     ORDER BY created_at DESC`
  ).all();

  return json(results);
}

export async function onRequestPost({ request, env }) {
  const adminError = assertAdmin(request, env);
  if (adminError) return json({ error: adminError }, { status: 401 });

  const body = await request.json();
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim().toLowerCase();
  const excerpt = String(body.excerpt || "").trim();
  const tags = String(body.tags || "").trim();
  const content = String(body.content || "").trim();

  if (!title || !slug || !content) {
    return json({ error: "标题、Slug 和正文不能为空。" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: "Slug 只能包含小写字母、数字和短横线。" }, { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO posts (title, slug, excerpt, tags, content, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
     ON CONFLICT(slug) DO UPDATE SET
       title = excluded.title,
       excerpt = excluded.excerpt,
       tags = excluded.tags,
       content = excluded.content,
       published = 1,
       updated_at = datetime('now')`
  ).bind(title, slug, excerpt, tags, content).run();

  return json({ ok: true, slug });
}
