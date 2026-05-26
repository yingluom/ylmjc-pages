function json(data, init = {}) {
  return Response.json(data, {
    headers: { "cache-control": "no-store" },
    ...init
  });
}

function assertAdmin(request, env) {
  const configured = env.ADMIN_TOKEN;
  const provided = request.headers.get("x-admin-token");

  if (!configured) return "Cloudflare 环境变量 ADMIN_TOKEN 还没有设置。";
  if (!provided || provided !== configured) return "管理密钥不正确。";
  return null;
}

export async function onRequestGet({ env, params }) {
  const post = await env.DB.prepare(
    `SELECT id, title, slug, excerpt, tags, content, created_at, updated_at
     FROM posts
     WHERE slug = ? AND published = 1`
  ).bind(params.slug).first();

  if (!post) return json({ error: "文章不存在。" }, { status: 404 });
  return json(post);
}

export async function onRequestDelete({ request, env, params }) {
  const adminError = assertAdmin(request, env);
  if (adminError) return json({ error: adminError }, { status: 401 });

  await env.DB.prepare(
    "UPDATE posts SET published = 0, updated_at = datetime('now') WHERE slug = ?"
  ).bind(params.slug).run();

  return json({ ok: true });
}
