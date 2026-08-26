// dsf_14_cross_phase_saw - cross-phase fields cut by wide saw masks
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

  let xFreq = rnd_btw(5, 15);
  let yFreq = rnd_btw(5, 15);
  let p = rnd_int(34, 88);

  osc(xFreq, 0.035, 0.8)
    .diff(osc(yFreq, 0.035, 0.8).rotate(Math.PI / 2))
    .modulate(gradient(1).repeat(rnd_int(2, 5), 1).thresh(() => 0.55 - a.fft[0] * 0.25), () => 0.08 + a.fft[1] * 0.22)
    .mult(shape(2, () => 0.28 + a.fft[0] * 0.22, 0.001).scale(1.8, 1))
    .modulateScale(noise(1.7, 0.18), () => 0.1 + a.fft[0] * 0.55)
    .pixelate(p, p)
    .posterize(rnd_int(3, 5), 0.42)
    .add(src(o0).scale(1.005).luma(0.08).colorama(0.016), 0.44)
    .modulatePixelate(noise(2, 0.2), () => 10 + a.fft[3] * 90)
    .color(rnd_btw(0.6, 1.25), rnd_btw(0.8, 1.5), rnd_btw(0.45, 1.2))
    .colorama(() => 0.018 + a.fft[4] * 0.22)
    .out();

  speed = 0.14;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
