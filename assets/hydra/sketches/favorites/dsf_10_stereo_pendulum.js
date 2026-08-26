// dsf_10_stereo_pendulum - bass and treble pendulums colliding at center
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

  let swing = rnd_btw(0.45, 1.25);
  let p = rnd_int(34, 88);

  shape(2, () => 0.075 + a.fft[0] * 0.16, 0.001).scale(1.9, 0.28).rotate(() => Math.sin(time * swing) * (0.65 + a.fft[0]))
    .add(shape(2, () => 0.075 + a.fft[3] * 0.18, 0.001).scale(1.9, 0.25).rotate(() => -Math.sin(time * swing * 1.31) * (0.65 + a.fft[3])).scrollY(() => Math.sin(time * 0.2) * 0.04), 0.9)
    .mult(osc(rnd_btw(24, 56), 0.018, 0.9).thresh(() => 0.45 - a.fft[1] * 0.14))
    .diff(src(o0).scale(1.008).rotate(() => 0.003 + a.fft[2] * 0.018).luma(0.16), 0.42)
    .pixelate(p, p)
    .posterize(rnd_int(2, 4), 0.52)
    .add(noise(9, 0.35).thresh(0.91).pixelate(p * 2, p), () => a.fft[4] * 0.55)
    .color(rnd_btw(0.7, 1.35), rnd_btw(0.4, 1), rnd_btw(0.9, 1.6))
    .colorama(() => 0.02 + a.fft[5] * 0.22)
    .out();

  speed = 0.24;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
