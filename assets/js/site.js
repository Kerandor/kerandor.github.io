// Site behaviour: the channel dial, the player it drives, and the retune
// transition between them.
//
// Only ever one live player iframe. Each sketch patches hydra's output
// prototype and reaches for canvas[0] by tag name, so two sharing a document
// would collide, and a grid of live WebGL contexts would flatten a phone.

(function () {
"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HASH_ALPHABET = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

// fxhash format. Without one of these the player falls back to the seed pinned
// in the catalog, which made reseed a plain restart.
const randomHash = () =>
  "oo" + Array.from({ length: 49 }, () => HASH_ALPHABET[(Math.random() * HASH_ALPHABET.length) | 0]).join("");

const shuffled = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/* ------------------------------------------------------------------ player */

class Player {
  constructor(frame, { autoplay = true } = {}) {
    this.frame = frame;
    this.iframe = frame.querySelector("iframe");
    this.autoplay = autoplay && !reduceMotion;
    this.audio = "synth";
    this.current = null;
    this.hash = null;
    this.running = false;
    this.listeners = {};

    window.addEventListener("message", (e) => {
      const m = e.data;
      if (!m || m.source !== "hydra-player") return;
      if (m.type === "ready") {
        this.hash = m.hash;
        this.frame.removeAttribute("data-tearing");
      }
      if (m.type === "state") this.running = m.running;
      (this.listeners[m.type] || []).forEach((fn) => fn(m));
    });
  }

  on(type, fn) { (this.listeners[type] ||= []).push(fn); return this; }

  send(type, extra = {}) {
    this.iframe.contentWindow?.postMessage({ target: "hydra-player", type, ...extra }, "*");
  }

  url(id, hash) {
    const p = new URLSearchParams({ sketch: id, audio: this.audio });
    if (hash) p.set("hash", hash);
    if (reduceMotion) p.set("still", "1");
    return `player.html?${p}`;
  }

  // Load with no transition. Used for first paint and deep links.
  load(id, hash) {
    this.current = id;
    this.hash = hash || null;
    this.iframe.src = this.url(id, hash);
  }

  // Signal loss, then swap. The tear itself runs inside hydra; the vertical
  // hold roll is the CSS half of the same gesture.
  async retune(id, hash) {
    if (id === this.current && !hash) return;
    if (reduceMotion) return this.load(id, hash);

    this.current = id;
    this.frame.setAttribute("data-tearing", "");
    this.send("tear");

    await new Promise((done) => {
      const t = setTimeout(done, 520); // never strand the UI on a dropped message
      this.on("torn", () => { clearTimeout(t); done(); });
    });

    this.iframe.src = this.url(id, hash);
  }

  pause() { this.send("pause"); this.running = false; }
  resume() { this.send("resume"); this.running = true; }

  setAudio(mode) {
    this.audio = mode;
    // hydra attaches its analyser at construction, so switching sources means
    // rebuilding the instance rather than swapping it live.
    this.iframe.src = this.url(this.current, this.hash);
  }

  reseed() {
    const next = randomHash();
    this.hash = next;
    this.iframe.src = this.url(this.current, next);
  }

  permalink() {
    const u = new URL(location.href);
    u.hash = this.current;
    if (this.hash) u.searchParams.set("hash", this.hash);
    else u.searchParams.delete("hash");
    return u.toString();
  }
}

/* ------------------------------------------------------------------- dial */

// Numbering comes from the sketch id, not the display order, so it stays
// meaningful now that the list is shuffled on each visit.
const stationNumber = (id) => (id.match(/^ds[fr]?_(\d+)/) || [])[1] || "";

function stationMarkup(sketch) {
  const warn = sketch.tags.includes("strobe-risk") || sketch.tags.includes("intense");
  const no = stationNumber(sketch.id);
  return `
    <button class="station" type="button" role="tab" data-id="${sketch.id}" aria-current="false">
      <img class="station__thumb" src="assets/img/thumbs/${sketch.id}.webp" alt="" loading="lazy"
           decoding="async" onerror="this.style.visibility='hidden'">
      <span class="station__meta">
        <span class="station__no">${no ? no + " / " : ""}${sketch.series}</span>
        <span class="station__title">${sketch.title}</span>
        <span class="station__blurb">${sketch.blurb || ""}</span>
        ${warn ? '<span class="badge badge--warn">flashing</span>' : ""}
      </span>
    </button>`;
}

async function initGallery(root) {
  const catalog = await (await fetch("assets/data/catalog.json")).json();
  // Fresh order on every visit so the same few pieces are not always the ones
  // anyone sees. Deep links still resolve by id.
  const sketches = shuffled(catalog.sketches);

  const dial = root.querySelector("[data-dial]");
  const frame = root.querySelector("[data-stage]");
  const titleEl = root.querySelector("[data-now-title]");
  const blurbEl = root.querySelector("[data-now-blurb]");

  dial.innerHTML = sketches.map(stationMarkup).join("");
  const player = new Player(frame);

  const byId = new Map(sketches.map((s) => [s.id, s]));
  let pending = 0;

  // Scroll inside the dial only. scrollIntoView walks up and scrolls the page
  // too, which pulled the player out of view when arrowing through the list.
  function revealStation(el) {
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    const behavior = reduceMotion ? "auto" : "smooth";
    if (top < dial.scrollTop) dial.scrollTo({ top, behavior });
    else if (bottom > dial.scrollTop + dial.clientHeight) {
      dial.scrollTo({ top: bottom - dial.clientHeight, behavior });
    }
  }

  function select(id, { hash = null, scroll = true } = {}) {
    const sketch = byId.get(id);
    if (!sketch) return;

    dial.querySelectorAll(".station").forEach((el) => {
      const on = el.dataset.id === id;
      el.setAttribute("aria-current", String(on));
      if (on && scroll) revealStation(el);
    });

    titleEl.textContent = sketch.title;
    blurbEl.textContent = sketch.blurb || "";
    history.replaceState(null, "", `#${id}`);

    player.current ? player.retune(id, hash) : player.load(id, hash);
  }

  dial.addEventListener("click", (e) => {
    const station = e.target.closest(".station");
    if (!station) return;
    // Debounced so dragging across the dial does not thrash WebGL contexts.
    clearTimeout(pending);
    pending = setTimeout(() => select(station.dataset.id), 120);
  });

  dial.addEventListener("keydown", (e) => {
    const stations = [...dial.querySelectorAll(".station")];
    const at = stations.findIndex((el) => el.getAttribute("aria-current") === "true");
    let to = null;

    if (e.key === "ArrowDown") to = at + 1;
    else if (e.key === "ArrowUp") to = at - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = stations.length - 1;
    else return;

    const next = stations[Math.max(0, Math.min(stations.length - 1, to))];
    if (!next) return;
    e.preventDefault();
    // preventScroll because focus() scrolls the page as well as the container.
    next.focus({ preventScroll: true });
    select(next.dataset.id);
  });

  /* controls */
  const btn = (name) => root.querySelector(`[data-control="${name}"]`);

  // Keep the play control honest about what the player is actually doing.
  // Under reduced motion it never starts, so the button has to say "play".
  const playBtn = btn("play");
  const syncPlay = (running) => {
    if (!playBtn) return;
    playBtn.querySelector("span").textContent = running ? "pause" : "play";
    playBtn.setAttribute("aria-pressed", String(!running));
  };
  player.on("state", (m) => syncPlay(m.running));
  player.on("ready", () => syncPlay(player.autoplay));
  syncPlay(false);

  playBtn?.addEventListener("click", () => {
    player.running ? player.pause() : player.resume();
    syncPlay(!player.running);
  });

  btn("mic")?.addEventListener("click", (e) => {
    const on = player.audio === "synth";
    player.setAudio(on ? "mic" : "synth");
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.querySelector("span").textContent = on ? "mic on" : "use mic";
  });

  btn("reseed")?.addEventListener("click", () => player.reseed());

  btn("link")?.addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(player.permalink());
      const label = e.currentTarget.querySelector("span");
      label.textContent = "copied";
      setTimeout(() => { label.textContent = "copy link"; }, 1600);
    } catch { /* clipboard blocked, nothing useful to say */ }
  });

  /* Fullscreen.
     iOS Safari does not implement Element.requestFullscreen at all; only video
     elements can go fullscreen there. The optional call just did nothing, so
     fall back to a fixed overlay, which works everywhere. */
  const fullBtn = btn("full");
  let overlaid = false;

  const nativeTarget = () => document.fullscreenElement || document.webkitFullscreenElement;

  const syncFull = () => {
    const on = Boolean(nativeTarget()) || overlaid;
    frame.classList.toggle("is-overlaid", overlaid);
    document.documentElement.classList.toggle("has-overlay", overlaid);
    if (fullBtn) fullBtn.querySelector("span").textContent = on ? "exit" : "fullscreen";
  };

  const setOverlay = (on) => { overlaid = on; syncFull(); };

  const exitFull = () => {
    if (nativeTarget()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (overlaid) setOverlay(false);
  };

  fullBtn?.addEventListener("click", async () => {
    if (nativeTarget() || overlaid) return exitFull();

    const request = frame.requestFullscreen || frame.webkitRequestFullscreen;
    if (!request) return setOverlay(true);
    try {
      await request.call(frame);
      syncFull();
    } catch {
      setOverlay(true); // present but refused, for instance inside some embeds
    }
  });

  root.querySelector("[data-control='exit-full']")?.addEventListener("click", exitFull);
  document.addEventListener("fullscreenchange", syncFull);
  document.addEventListener("webkitfullscreenchange", syncFull);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlaid) exitFull(); });

  // Stop rendering while the player is off screen. WebGL keeps burning battery
  // otherwise, which matters most on the phones this is meant to work on.
  new IntersectionObserver(([entry]) => {
    if (!entry) return;
    entry.isIntersecting ? (player.autoplay && player.resume()) : player.pause();
  }, { threshold: 0.15 }).observe(frame);

  const wanted = location.hash.slice(1);
  const startHash = new URLSearchParams(location.search).get("hash");
  select(byId.has(wanted) ? wanted : sketches[0].id, { hash: startHash, scroll: Boolean(wanted) });
}

/* -------------------------------------------------------------------- hero */

function initHero(frame) {
  const id = frame.dataset.sketch;
  const iframe = frame.querySelector("iframe");
  const params = new URLSearchParams({ sketch: id, audio: "synth" });
  if (reduceMotion) params.set("still", "1");
  iframe.src = `player.html?${params}`;

  new IntersectionObserver(([entry]) => {
    if (!entry) return;
    iframe.contentWindow?.postMessage(
      { target: "hydra-player", type: entry.isIntersecting && !reduceMotion ? "resume" : "pause" }, "*");
  }, { threshold: 0.1 }).observe(frame);
}

/* -------------------------------------------------------------------- boot */

document.querySelectorAll("[data-hero]").forEach(initHero);
const gallery = document.querySelector("[data-gallery]");
if (gallery) initGallery(gallery);
})();
