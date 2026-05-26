const form = document.querySelector("[data-editor]");
const statusNode = document.querySelector("[data-admin-status]");
const clearButton = document.querySelector("[data-clear]");

const savedToken = localStorage.getItem("yl-blog-admin-token");
if (savedToken) form.elements.token.value = savedToken;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  localStorage.setItem("yl-blog-admin-token", data.token || "");
  statusNode.textContent = "正在保存...";

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-token": data.token || ""
      },
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        tags: data.tags,
        content: data.content
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "保存失败");
    statusNode.textContent = "已保存。";
  } catch (error) {
    statusNode.textContent = error.message;
  }
});

clearButton?.addEventListener("click", () => {
  const token = form.elements.token.value;
  form.reset();
  form.elements.token.value = token;
  statusNode.textContent = "";
});
