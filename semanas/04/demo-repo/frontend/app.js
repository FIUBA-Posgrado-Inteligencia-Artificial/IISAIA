const API = "http://localhost:8000";

async function refreshUsers() {
  const r = await fetch(`${API}/users`);
  const data = await r.json();
  document.querySelector("#user-list").innerHTML =
    data.map(u => `<li>#${u.id} — ${u.name} (${u.email})</li>`).join("");
}

async function refreshPosts() {
  const r = await fetch(`${API}/posts`);
  const data = await r.json();
  document.querySelector("#post-list").innerHTML =
    data.map(p => `<li>#${p.id} — ${p.title} (author ${p.author_id})</li>`).join("");
}

function bindForm(formId, path, refresh) {
  document.querySelector(formId).addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const token = form.get("token");
    form.delete("token");
    const payload = Object.fromEntries(form.entries());
    if (payload.author_id) payload.author_id = Number(payload.author_id);
    const r = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!r.ok) alert(`Error ${r.status}: ${await r.text()}`);
    else { e.target.reset(); refresh(); }
  });
}

bindForm("#user-form", "/users", refreshUsers);
bindForm("#post-form", "/posts", refreshPosts);
refreshUsers();
refreshPosts();
