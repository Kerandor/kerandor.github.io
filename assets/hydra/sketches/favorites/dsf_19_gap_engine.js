// dsf_19_gap_engine - spaced oscillator engine with mechanical hinge overlays
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let sparse = rnd_btw(0.35, 1);
  let carrier = rnd_btw(80, 190);
  let p = rnd_int(24, 70);

  osc(sparse, 0.01, 0.34).thresh(() => 0.75 - a.fft[0] * 0.4)
    .diff(osc(sparse * 1.45, 0.01, 0.34).rotate(Math.PI).thresh(() => 0.75 - a.fft[1] * 0.36))
    .mult(osc(carrier, 0.008, 1.1).rotate(Math.PI / 2))
    .add(shape(3, () => 0.18 + a.fft[0] * 0.22, 0.001).scale(0.8, 1.7).scrollX(-0.24).rotate(() => -0.4 - a.fft[0] * 0.45), 0.34)
    .add(shape(3, () => 0.18 + a.fft[1] * 0.22, 0.001).scale(0.8, 1.7).scrollX(0.24).rotate(() => 0.4 + a.fft[1] * 0.45), 0.34)
    .pixelate(() => p + a.fft[3] * 80, p)
    .posterize(rnd_int(2, 4), 0.55)
    .add(src(o0).scale(1.005).luma(0.06).colorama(0.014), 0.48)
    .modulate(noise(0.4).pixelate(2, p * 3), () => 0.004 + a.fft[2] * 0.028)
    .color(rnd_btw(0.8, 1.5), rnd_btw(0.45, 1.05), rnd_btw(0.75, 1.4))
    .out();

  speed = 0.08;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
