// dsf_01_pendulum_gate - pendulum arms through a bass-opened center gate
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  a.setBins(8);
  o0.setMode("nearest");
  fps = 30;

  let swing = rnd_btw(0.45, 1.2);
  let p = rnd_int(34, 86);
  let gate = shape(2, () => 0.12 + a.fft[0] * 0.32, 0.001).scale(1.85, 0.46);

  shape(2, () => 0.07 + a.fft[0] * 0.15, 0.001)
    .scale(1.9, 0.28)
    .rotate(() => Math.sin(time * swing) * 0.9)
    .add(shape(2, () => 0.07 + a.fft[1] * 0.16, 0.001).scale(1.9, 0.28).rotate(() => -Math.sin(time * swing * 0.87) * 0.9), 0.92)
    .mult(gate)
    .mult(osc(rnd_btw(20, 48), 0.015, 0.9).thresh(() => 0.44 - a.fft[0] * 0.18))
    .pixelate(p, p)
    .posterize(2, 0.6)
    .add(src(o0).scale(1.006).rotate(() => 0.003 + a.fft[2] * 0.012).luma(0.18), 0.42)
    .add(noise(8, 0.35).thresh(() => 0.91 - a.fft[3] * 0.18).pixelate(p * 2, p), 0.36)
    .modulate(noise(0.6).pixelate(2, 140), () => 0.003 + a.fft[2] * 0.018)
    .color(rnd_btw(0.8, 1.45), rnd_btw(0.35, 0.9), rnd_btw(0.9, 1.6))
    .colorama(() => 0.018 + a.fft[4] * 0.24)
    .out();

  speed = 0.22;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
