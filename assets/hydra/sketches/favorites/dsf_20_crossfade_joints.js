// dsf_20_crossfade_joints - hinge, pendulum, and bitfield layers crossfaded by audio
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

  let p = rnd_int(34, 86);
  let swing = rnd_btw(0.45, 1.1);
  let bit = osc(rnd_btw(60, 150), 0, 1).thresh(() => 0.5 - a.fft[2] * 0.2).pixelate(p, p).repeat(rnd_int(2, 5), 1);

  shape(2, () => 0.08 + a.fft[0] * 0.16, 0.001).scale(1.9, 0.28).rotate(() => Math.sin(time * swing) * 0.8)
    .add(shape(3, () => 0.22 + a.fft[0] * 0.24, 0.001).scale(0.82, 1.7).scrollX(-0.22).rotate(() => -0.35 - a.fft[0] * 0.45), () => 0.35 + a.fft[0] * 0.35)
    .add(shape(3, () => 0.22 + a.fft[1] * 0.24, 0.001).scale(0.82, 1.7).scrollX(0.22).rotate(() => 0.35 + a.fft[1] * 0.45), () => 0.35 + a.fft[1] * 0.35)
    .diff(bit, () => 0.25 + a.fft[2] * 0.55)
    .mult(osc(rnd_btw(18, 44), 0.018, 0.85).rotate(Math.PI / 2))
    .pixelate(p, p)
    .posterize(rnd_int(3, 5), 0.45)
    .add(src(o0).scale(1.005).rotate(() => 0.002 + a.fft[3] * 0.012).colorama(0.016), 0.44)
    .modulate(noise(0.6).pixelate(2, 140), () => 0.003 + a.fft[4] * 0.02)
    .color(rnd_btw(0.75, 1.4), rnd_btw(0.45, 1.15), rnd_btw(0.8, 1.55))
    .out();

  speed = 0.2;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
