async function render() {
  const data = await chrome.storage.local.get({ hits: [], count: 0 });
  document.getElementById("count").textContent = String(data.count || 0);

  const list = document.getElementById("list");
  list.innerHTML = "";

  const hits = data.hits || [];
  if (!hits.length) {
    list.innerHTML = `<div style="color:#666;font-size:12px;">No hits yet. Browse and play the video to trigger requests.</div>`;
    return;
  }

  for (const h of hits) {
    const div = document.createElement("div");
    div.className = "item";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${h.time}  |  ${h.method || ""}  |  ${h.type || ""}`;

    const url = document.createElement("div");
    url.className = "url";
    url.textContent = h.url;

    const btn = document.createElement("button");
    btn.className = "smallbtn";
    btn.textContent = "Copy";
    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(h.url);
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 800);
    });

    div.appendChild(meta);
    div.appendChild(url);
    div.appendChild(btn);
    list.appendChild(div);
  }
}

document.getElementById("btnClear").addEventListener("click", async () => {
  await chrome.storage.local.set({ hits: [], count: 0 });
  chrome.action.setBadgeText({ text: "" });
  await render();
});

document.getElementById("btnCopyLatest").addEventListener("click", async () => {
  const data = await chrome.storage.local.get({ hits: [] });
  const hits = data.hits || [];
  if (!hits.length) return;
  await navigator.clipboard.writeText(hits[0].url);
});

render();
