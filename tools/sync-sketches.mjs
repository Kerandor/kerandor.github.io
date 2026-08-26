#!/usr/bin/env node
// Pulls curated hydra sketches out of the hydraz collection and regenerates
// assets/data/catalog.json. Re-run after adding sketches upstream.
//
//   node tools/sync-sketches.mjs [--source /path/to/hydraz]

import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argIndex = process.argv.indexOf("--source");
const SOURCE = argIndex > -1
  ? resolve(process.argv[argIndex + 1])
  : resolve(process.env.HOME, "Documents/ik/Internet-Kids/hydraz");

// Which upstream files ship on the site, and where they land.
const SERIES = [
  { dir: "dual-signal", label: "Dual Signal", from: "dual_signal", match: /^ds_\d+_.*\.js$/ },
  { dir: "favorites",   label: "Favorites",   from: "dual_signal/favorites", match: /^dsf_\d+_.*\.js$/ }
];

// Older standalone pieces that were previously deployed to Vercel one-per-site.
const WORKS = ["dithers", "warbles", "doppler", "puddlez", "kaleid", "brainfuzz"];

// Patches lifted from the original hand-written pages, preserved as sketches.
const SITE = ["hydras_patch", "contact_patch"];

// sketches.json tags all 20 favorites `voro`, but none of them call voronoi().
const BAD_TAGS = new Set(["voro", "favorites", "variations"]);

// Upstream notes are inconsistent: the ds_ set is lowercase with no full stop,
// the dsf_ set is sentence case with one. Cards read better uniform and
// unpunctuated, so normalise both ways here rather than editing upstream.
const blurb = (note) => {
  const t = (note || "").trim().replace(/\.$/, "");
  return t ? t[0].toUpperCase() + t.slice(1) : "";
};

const titleCase = (stem) => stem
  .replace(/^(ds|dsf|dsr)_\d+_/, "")
  .split(/[_-]/)
  .filter(Boolean)
  .map((w) => (/^(rgb|crt|vhs|fft|p5)$/i.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
  .join(" ");

const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: SOURCE, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

let prevSeeds = new Map();
try {
  const prev = JSON.parse(readFileSync(join(repoRoot, "assets/data/catalog.json"), "utf8"));
  prevSeeds = new Map(prev.sketches.filter((s) => s.seed).map((s) => [s.id, s.seed]));
} catch { /* first run */ }

const upstream = JSON.parse(readFileSync(join(SOURCE, "sketches.json"), "utf8"));
const byPath = new Map(upstream.sketches.map((s) => [s.path, s]));

const entries = [];
let copied = 0;

const take = (upstreamPath, destDir, seriesLabel) => {
  const stem = upstreamPath.split("/").pop().replace(/\.js$/, "");
  const meta = byPath.get(upstreamPath) || {};
  const destRel = `assets/hydra/sketches/${destDir}/${stem}.js`;

  mkdirSync(join(repoRoot, "assets/hydra/sketches", destDir), { recursive: true });
  copyFileSync(join(SOURCE, upstreamPath), join(repoRoot, destRel));
  copied += 1;

  const source = readFileSync(join(SOURCE, upstreamPath), "utf8");

  entries.push({
    id: stem,
    file: destRel,
    title: meta.title || titleCase(stem),
    series: seriesLabel,
    blurb: blurb(meta.notes),
    tags: (meta.tags || []).filter((t) => !BAD_TAGS.has(t)).sort(),
    // Drives the player: sketches touching `a` need the audio shim installed.
    usesAudio: /\ba\.(fft|setBins|setSmooth|setCutoff|setScale)/.test(source),
    usesFxrand: /\bfxrand\s*\(/.test(source),
    // Several pieces run at speed 0.1, so they need far longer to develop than
    // wall clock suggests. capture.mjs uses this to pick a settle time.
    speed: Number((source.match(/^\s*speed\s*=\s*([\d.]+)/m) || [])[1]) || 1,
    // Filled in by tools/capture.mjs. fxrand drives each piece's frequencies,
    // so some seeds render near-black; this pins one that does not.
    seed: prevSeeds.get(stem) || null
  });
};

for (const s of SERIES) {
  const listing = execFileSync("ls", [join(SOURCE, s.from)], { encoding: "utf8" })
    .split("\n").filter((f) => s.match.test(f)).sort();
  for (const file of listing) take(`${s.from}/${file}`, s.dir, s.label);
}

for (const name of WORKS) take(`${name}.js`, "works", "Works");

// Site patches already live in this repo; catalog them without copying.
for (const name of SITE) {
  const destRel = `assets/hydra/sketches/site/${name}.js`;
  const source = readFileSync(join(repoRoot, destRel), "utf8");
  entries.push({
    id: name,
    file: destRel,
    title: name === "hydras_patch" ? "Voronoi Bloom" : "Hex Bloom",
    series: "Site",
    blurb: name === "hydras_patch"
      ? "The patch that ran on the original hydra page."
      : "The patch that ran on the original contact page.",
    tags: ["feedback"],
    usesAudio: /\ba\.(fft|setBins)/.test(source),
    usesFxrand: /\bfxrand\s*\(/.test(source),
    speed: Number((source.match(/^\s*speed\s*=\s*([\d.]+)/m) || [])[1]) || 1,
    seed: prevSeeds.get(name) || null
  });
}

const catalog = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source: { repo: "Internet-Kids/hydraz", branch: git("rev-parse", "--abbrev-ref", "HEAD"), commit: git("rev-parse", "--short", "HEAD") },
  sketches: entries
};

mkdirSync(join(repoRoot, "assets/data"), { recursive: true });
writeFileSync(join(repoRoot, "assets/data/catalog.json"), JSON.stringify(catalog, null, 2) + "\n");

console.log(`copied   ${copied} sketch files`);
console.log(`catalog  ${entries.length} entries -> assets/data/catalog.json`);
console.log(`source   ${catalog.source.branch}@${catalog.source.commit}`);
console.log(`audio    ${entries.filter((e) => e.usesAudio).length} need the fft shim`);
console.log(`fxrand   ${entries.filter((e) => e.usesFxrand).length} need fxrand`);
console.log(`seeds    ${entries.filter((e) => e.seed).length} pinned (run tools/capture.mjs to fill the rest)`);
