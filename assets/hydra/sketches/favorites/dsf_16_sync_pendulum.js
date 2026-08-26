// dsf_16_sync_pendulum - pendulum strokes periodically losing sync
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let swing = rnd_btw(0.45, 1.1);
  let p = rnd_int(32, 82);

  shape(2, () => 0.08 + a.fft[0] * 0.16, 0.001).scale(1.9, 0.28).rotate(() => Math.sin(time * swing) * 0.85)
    .add(shape(2, () => 0.08 + a.fft[1] * 0.16, 0.001).scale(1.9, 0.28).rotate(() => -Math.sin(time * swing * (0.8 + Math.sin(time * 0.07) * 0.08)) * 0.85), 0.9)
    .mult(osc(rnd_btw(18, 44), 0.018, 0.8).thresh(() => 0.45 - a.fft[0] * 0.15))
    .modulate(noise(0.5, 0.12).pixelate(2, 160), () => 0.004 + Math.max(0, Math.sin(time * 0.13)) * 0.025 + a.fft[2] * 0.018)
    .diff(src(o0).scale(1.009).rotate(() => 0.003 + a.fft[3] * 0.018).luma(0.16), 0.42)
    .pixelate(p, p)
    .posterize(2, 0.58)
    .add(noise(8, 0.35).thresh(0.9).pixelate(p * 2, p), () => a.fft[3] * 0.5)
    .color(rnd_btw(0.75, 1.4), rnd_btw(0.35, 0.9), rnd_btw(0.9, 1.55))
    .out();

  speed = 0.2;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
