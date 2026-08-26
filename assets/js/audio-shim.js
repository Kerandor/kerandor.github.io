// Synthetic FFT driver.
//
// Every dual_signal sketch opens its gates and thresholds with `a.fft[n]`, and
// hydra only defines `a` when detectAudio is on. With detectAudio off the very
// first line of each sketch (`a.setBins(8)`) throws, so this stands in for the
// analyser and feeds it plausible band energy derived from time.
//
// Bands are shaped so bin 0 swells slowly and deeply the way a kick does, while
// higher bins move faster and shallower. The three sine terms sit at
// incommensurate ratios so the pattern never settles into an obvious loop.

(function () {
"use strict";

const BAND_RATE = 0.55;   // base cycles per second for bin 0
const BAND_SPREAD = 1.72; // each bin up is this much faster
const FLOOR = 0.012;      // keeps thresholds off a hard zero

function band(t, i) {
  const rate = BAND_RATE * Math.pow(BAND_SPREAD, i);
  const a1 = Math.sin(2 * Math.PI * (t * rate * 0.5 + i * 0.13));
  const a2 = Math.sin(2 * Math.PI * (t * rate * 0.31 + i * 0.41));
  const a3 = Math.sin(2 * Math.PI * (t * rate * 0.187));

  // Fold to 0..1, then bias toward peaks. Lower bins get the peakier curve.
  let v = 0.5 + 0.5 * (a1 * 0.55 + a2 * 0.3 + a3 * 0.15);
  v = Math.pow(v, Math.max(1.1, 3.2 - i * 0.28));

  return Math.min(1, v * 0.95 * Math.pow(0.86, i) + FLOOR);
}

function installAudioShim(bins = 8) {
  let fft = new Array(bins).fill(0);
  let lastUpdate = -1;
  let scale = 1;
  const origin = performance.now() / 1000;

  const refresh = () => {
    const now = performance.now();
    if (now - lastUpdate < 8) return; // at most once per frame
    lastUpdate = now;
    const t = now / 1000 - origin;
    for (let i = 0; i < fft.length; i++) fft[i] = band(t, i) * scale;
  };

  const a = {
    get fft() {
      refresh();
      return fft;
    },
    setBins(n) {
      fft = new Array(Math.max(1, n | 0)).fill(0);
      lastUpdate = -1;
    },
    setScale(n) { scale = n; },
    setSmooth() {}, setCutoff() {}, setMax() {},
    show() {}, hide() {}, tick() {},
    synthetic: true
  };

  window.a = a;
  return a;
}

window.installAudioShim = installAudioShim;
})();
