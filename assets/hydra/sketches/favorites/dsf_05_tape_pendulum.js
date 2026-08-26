// dsf_05_tape_pendulum - tape-wobble carrier around crossing pendulum strokes
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("linear");
  fps = 30;

  let swing = rnd_btw(0.4, 1);
  let carrier = rnd_btw(22, 52);
  let p = rnd_int(66, 140);

  shape(2, () => 0.08 + a.fft[0] * 0.14, 0.001)
    .scale(1.9, 0.3).rotate(() => Math.sin(time * swing) * 0.75)
    .add(shape(2, () => 0.08 + a.fft[1] * 0.16, 0.001).scale(1.9, 0.3).rotate(() => -Math.sin(time * swing * 0.91) * 0.75), 0.9)
    .mult(osc(carrier, 0.018, 1).rotate(Math.PI / 2).modulate(noise(1.2, 0.15).pixelate(400, 8), () => 0.02 + a.fft[1] * 0.07))
    .pixelate(p, rnd_int(10, 28))
    .add(src(o0).scrollY(() => 0.002 + a.fft[0] * 0.01).scale(1.002).color(1.35, 0.48, 0.65), 0.34)
    .add(src(o0).scrollY(() => -0.002 - a.fft[2] * 0.01).scale(0.999).color(0.45, 0.9, 1.35), 0.28)
    .modulate(noise(0.55).pixelate(2, 220), () => 0.004 + a.fft[3] * 0.026)
    .hue(() => Math.sin(time * 0.05) * 0.1 + a.fft[1] * 0.22)
    .out();

  speed = 0.32;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
