const $ = id => document.getElementById(id);
const load = f => fetch(f).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

load("assets/projects/projects.json").then(list => {
  const grid = $("grid");
  if (!list.length) { grid.innerHTML = '<p class="note">No projects yet. Add entries to assets/projects/projects.json.</p>'; return; }
  grid.innerHTML = list.map((p, i) => `
    <button class="card" data-i="${i}">
      ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : '<div class="ph"></div>'}
      <div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div>
    </button>`).join("");
  grid.addEventListener("click", e => {
    const c = e.target.closest(".card"); if (!c) return;
    const p = list[c.dataset.i];
    $("viewer-img").src = p.image || ""; $("viewer-img").alt = p.title;
    $("viewer-title").textContent = p.title; $("viewer-desc").textContent = p.description || "";
    const a = $("viewer-link"); a.hidden = !p.link; if (p.link) a.href = p.link;
    $("viewer").showModal();
  });
}).catch(() => $("grid").innerHTML = '<p class="note">Could not load assets/projects/projects.json. Check that the file exists and is valid JSON.</p>');

load("team.json").then(list => {
  $("team-list").innerHTML = list.length
    ? list.map(m => `<li><span>${esc(m.name)}</span><small>${esc([m.roll, m.role].filter(Boolean).join(" · "))}</small></li>`).join("")
    : '<li class="note">No team members yet. Add entries to team.json.</li>';
}).catch(() => $("team-list").innerHTML = '<li class="note">Could not load team.json. Check that the file exists and is valid JSON.</li>');

$("close").onclick = () => $("viewer").close();
$("viewer").addEventListener("click", e => { if (e.target === $("viewer")) $("viewer").close(); });
