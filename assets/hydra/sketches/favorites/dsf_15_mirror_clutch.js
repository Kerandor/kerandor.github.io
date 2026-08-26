// dsf_15_mirror_clutch - two-sided doors snapping inward on bass
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let p = rnd_int(38, 98);
  let bite = rnd_btw(0.2, 0.38);

  shape(rnd_int(3, 5), () => bite + a.fft[0] * 0.3, 0.001).scale(0.95, 1.8).scrollX(() => -0.24 + a.fft[0] * 0.12)
    .add(shape(rnd_int(3, 5), () => bite + a.fft[1] * 0.3, 0.001).scale(0.95, 1.8).scrollX(() => 0.24 - a.fft[1] * 0.12).rotate(Math.PI), 0.92)
    .diff(noise(rnd_btw(4, 9), 0.3).thresh(() => 0.48 - a.fft[2] * 0.18).pixelate(p, p))
    .mult(osc(rnd_btw(20, 48), 0.018, 1.1).rotate(Math.PI / 2))
    .modulateScale(src(o0).luma(0.1), () => 0.04 + a.fft[0] * 0.28)
    .add(src(o0).scale(() => 1.004 + a.fft[0] * 0.012).colorama(0.016), 0.52)
    .pixelate(p, p)
    .posterize(rnd_int(3, 5), 0.42)
    .color(rnd_btw(0.8, 1.5), rnd_btw(0.35, 1), rnd_btw(0.75, 1.45))
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
