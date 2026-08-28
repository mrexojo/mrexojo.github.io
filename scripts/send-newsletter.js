// Envía por email los posts nuevos publicados desde el último push.
// Gratuita con el free tier de Resend (100 emails/día, 3.000/mes).
// Requiere secrets: RESEND_API_KEY, NEWSLETTER_FROM, NEWSLETTER_TO
// Opcional:      NEWSLETTER_AUDIENCE_ID (broadcast a audiencia en vez de email directo)

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const RESEND_API = "https://api.resend.com/emails";
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.NEWSLETTER_FROM || "mrexojo blog <onboarding@resend.dev>";
const TO = (process.env.NEWSLETTER_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
const AUDIENCE_ID = process.env.NEWSLETTER_AUDIENCE_ID || "";

const SITE_URL = "https://mrexojo.github.io";
const BLOG_URL = `${SITE_URL}/blog/`;

function postUrl(slug) {
  // Astro por defecto: /blog/<slug-sin-extension>/
  return `${BLOG_URL}${slug.replace(/\.(md|mdx)$/, "")}/`;
}

function getChangedPosts() {
  // Diff contra el commit anterior: solo ficheros de blog añadidos/modificados
  const out = execSync("git diff --name-status HEAD~1 HEAD", { encoding: "utf8" });
  return out
    .split("\n")
    .filter((l) => /^[AM]\s/.test(l))
    .map((l) => l.split("\t").pop())
    .filter((f) => f.startsWith("src/content/blog/") && /\.(md|mdx)$/.test(f));
}

function parseFrontmatter(content) {
  const fm = {};
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return fm;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return fm;
}

function mdToHtml(md) {
  // Conversión mínima sin dependencias: títulos, negrita, código inline, párrafos, listas
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks = md.split(/\n{2,}/);
  const html = blocks
    .map((b) => {
      const t = b.trim();
      if (!t) return "";
      if (t.startsWith("### ")) return `<h3>${esc(t.slice(4))}</h3>`;
      if (t.startsWith("## ")) return `<h2>${esc(t.slice(3))}</h2>`;
      if (t.startsWith("# ")) return `<h1>${esc(t.slice(2))}</h1>`;
      if (/^[-*] /m.test(t)) {
        const items = t.split("\n").map((l) => `<li>${inline(esc(l.replace(/^[-*] /, "")))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      if (t.startsWith("```")) {
        return `<pre style="background:#0d1117;color:#e6edf3;padding:12px;border-radius:6px;overflow:auto;font-size:13px"><code>${esc(t.replace(/^```\w*\n?/, "").replace(/```$/, ""))}</code></pre>`;
      }
      return `<p>${inline(esc(t))}</p>`;
    })
    .join("\n");
  return html;

  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
}

async function send(payload) {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

async function main() {
  if (!API_KEY) {
    console.log("RESEND_API_KEY no configurada - newsletter desactivado. Salgo sin fallo.");
    process.exit(0);
  }
  if (TO.length === 0 && !AUDIENCE_ID) {
    console.log("NEWSLETTER_TO y NEWSLETTER_AUDIENCE_ID vacíos - no hay destinatarios. Salgo sin fallo.");
    process.exit(0);
  }

  const files = getChangedPosts();
  if (files.length === 0) {
    console.log("Sin posts nuevos en este push.");
    process.exit(0);
  }

  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const fm = parseFrontmatter(raw);
    if (String(fm.draft).toLowerCase() === "true") {
      console.log(`Skip (draft): ${file}`);
      continue;
    }
    const title = fm.title || file;
    const desc = fm.description || "";
    const body = mdToHtml(raw.replace(/^---\n[\s\S]*?\n---/, ""));

    const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;line-height:1.6">
<h1 style="font-size:22px"><a href="${postUrl(file.replace("src/content/blog/", ""))}" style="color:#0969da;text-decoration:none">${title}</a></h1>
<p style="color:#555">${desc}</p>
${body}
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
<p style="font-size:12px;color:#888">Has recibido este email porque sigues el blog de mrexojo · <a href="${BLOG_URL}">mrexojo.github.io</a></p>
</body></html>`;

    if (AUDIENCE_ID) {
      // Broadcast a toda la audiencia (requiere permiso sending-domains/broadcast; si falla, cae a directo)
      try {
        const r = await fetch("https://api.resend.com/broadcasts", {
          method: "POST",
          headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ audience_id: AUDIENCE_ID, from: FROM, subject: title, html }),
        });
        if (!r.ok) throw new Error(await r.text());
        console.log(`Broadcast enviado: ${title}`);
        continue;
      } catch (e) {
        console.log(`Broadcast falló (${e.message}); envío directo como fallback.`);
      }
    }

    for (const to of TO) {
      const r = await send({ from: FROM, to, subject: title, html });
      console.log(`Enviado a ${to}: ${title} (id ${r.id})`);
    }
  }
}

main().catch((e) => {
  console.error("Newsletter error:", e.message);
  process.exit(1);
});
