#!/usr/bin/env node
// Renders every catalogued sketch in headless Chrome, finds a seed that
// actually produces an image, writes a poster frame, and pins that seed back
// into the catalog so visitors never land on a dud variant.
//
//   node tools/capture.mjs                 # full pass, updates catalog + posters
//   node tools/capture.mjs --check         # report only, writes nothing
//   node tools/capture.mjs --id <sketchId> # single sketch
//
// Needs a static server on PORT (default 8765) and ffmpeg.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = process.env.PORT || 8765;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = join(repoRoot, "assets/img/thumbs");
const TMP = join(repoRoot, ".capture-tmp");
const CATALOG = join(repoRoot, "assets/data/catalog.json");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const onlyId = args.includes("--id") ? args[args.indexOf("--id") + 1] : null;
const TRIES = Number(process.env.TRIES || 5);

// A frame is "good enough" once it has both range and contrast. Some pieces are
// legitimately sparse, so this is deliberately not a brightness test.
const GOOD = (s) => s.spread >= 8 && s.max >= 60;
const USABLE = (s) => s.spread >= 3 && s.max >= 12;

const ALPHABET = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

// Deterministic per (id, attempt) so a re-run reproduces the same search.
function seedFor(id, n) {
  let h = 2166136261 ^ n;
  for (const ch of id) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let out = "oo";
  for (let i = 0; i < 49; i++) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h |= 0;
    out += ALPHABET[Math.abs(h) % ALPHABET.length];
  }
  return out;
}

// Pieces that set speed = 0.1 develop ten times slower than wall clock, so a
// fixed settle time would capture them before anything has happened.
const settleFor = (speed) => Math.min(30000, Math.max(9000, Math.round(9000 / Math.max(speed || 1, 0.1))));

function shoot(id, seed, settle, file) {
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--enable-unsafe-swiftshader",
    "--use-gl=angle", "--use-angle=swiftshader",
    "--hide-scrollbars", "--window-size=1280,720",
    `--virtual-time-budget=${settle}`,
    `--screenshot=${file}`,
    `http://localhost:${PORT}/player.html?sketch=${id}&hash=${seed}`
  ], { stdio: "pipe", timeout: 120000 });
}

// Mean, max and spread of a 16x16 greyscale reduction. A sketch that never ran
// leaves max 0 and spread 0; a sparse one that did run still shows peaks.
function analyse(png) {
  const px = [...execFileSync("ffmpeg",
    ["-v", "error", "-i", png, "-vf", "scale=16:16", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
    { maxBuffer: 1 << 20 })];
  const mean = px.reduce((a, b) => a + b, 0) / px.length;
  const variance = px.reduce((a, b) => a + (b - mean) ** 2, 0) / px.length;
  return { mean, max: Math.max(...px), spread: Math.sqrt(variance) };
}

if (!existsSync(CHROME)) { console.error("Google Chrome not found."); process.exit(1); }

const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
const targets = onlyId ? catalog.sketches.filter((s) => s.id === onlyId) : catalog.sketches;

mkdirSync(TMP, { recursive: true });
if (!checkOnly) mkdirSync(OUT, { recursive: true });

const failures = [];

for (const s of targets) {
  const settle = settleFor(s.speed);
  let best = null;

  for (let attempt = 0; attempt < TRIES; attempt++) {
    const seed = attempt === 0 && s.seed ? s.seed : seedFor(s.id, attempt);
    const file = join(TMP, `${s.id}-${attempt}.png`);
    try { shoot(s.id, seed, settle, file); } catch { continue; }
    if (!existsSync(file)) continue;

    const stats = analyse(file);
    const score = stats.spread * 2 + stats.max / 8;
    if (!best || score > best.score) best = { ...stats, score, seed, file };
    if (GOOD(stats)) break;
  }

  if (!best || !USABLE(best)) {
    failures.push({ id: s.id, best });
    console.log(`FAIL ${s.id.padEnd(30)} nothing usable in ${TRIES} seeds (settle ${settle}ms)`);
    continue;
  }

  if (!checkOnly) {
    s.seed = best.seed;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", best.file,
      "-vf", "scale=640:-1", "-quality", "72", join(OUT, `${s.id}.webp`)]);
  }

  const mark = GOOD(best) ? "ok  " : "thin";
  console.log(`${mark} ${s.id.padEnd(30)} spread ${best.spread.toFixed(1).padStart(5)}  max ${String(best.max).padStart(3)}  settle ${String(settle).padStart(5)}  ${best.seed.slice(0, 10)}`);
}

if (!checkOnly) writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + "\n");
if (!process.env.KEEP_TMP) rmSync(TMP, { recursive: true, force: true });

console.log(`\n${targets.length - failures.length}/${targets.length} usable`);
if (failures.length) {
  console.log("failed: " + failures.map((f) => f.id).join(", "));
  process.exit(1);
}
