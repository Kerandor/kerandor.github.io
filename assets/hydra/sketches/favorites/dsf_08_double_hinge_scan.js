// dsf_08_double_hinge_scan - hinged panels with scanline interiors
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let hinge = rnd_btw(0.35, 0.95);
  let scan = rnd_int(180, 420);
  let p = rnd_int(58, 128);

  shape(rnd_int(3, 5), () => 0.25 + a.fft[0] * 0.28, 0.001).scale(0.85, 1.75).scrollX(-0.22).rotate(() => -hinge * (0.28 + a.fft[0]))
    .add(shape(rnd_int(3, 5), () => 0.25 + a.fft[0] * 0.28, 0.001).scale(0.85, 1.75).scrollX(0.22).rotate(() => hinge * (0.28 + a.fft[0])), 0.95)
    .mult(osc(scan, 0, 0).rotate(Math.PI / 2).thresh(0.42).add(solid(0.3)))
    .mult(osc(rnd_btw(16, 34), 0.025, 0.8).rotate(Math.PI / 2))
    .pixelate(p, rnd_int(18, 42))
    .add(src(o0).scale(1.003).scrollX(() => a.fft[1] * 0.008).colorama(0.012), 0.44)
    .modulate(noise(0.65).pixelate(240, 3), () => 0.004 + a.fft[2] * 0.025)
    .add(noise(12, 0.2).thresh(0.94).pixelate(p, p), () => a.fft[3] * 0.34)
    .color(rnd_btw(0.75, 1.4), rnd_btw(0.5, 1.1), rnd_btw(0.7, 1.35))
    .out();

  speed = 0.25;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
