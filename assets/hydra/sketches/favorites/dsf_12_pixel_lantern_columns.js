// dsf_12_pixel_lantern_columns - sparse twin pulses multiplied into columns
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let pulse = rnd_btw(0.2, 0.58);
  let cols = rnd_int(3, 8);
  let p = rnd_int(24, 62);

  osc(pulse, 0.01, 0.2).thresh(() => 0.79 - a.fft[0] * 0.44).scrollX(-0.22)
    .add(osc(pulse * 1.12, 0.01, 0.2).thresh(() => 0.79 - a.fft[1] * 0.42).scrollX(0.22), 0.95)
    .repeat(cols, 1)
    .mult(osc(rnd_btw(14, 36), 0.012, 1.2).rotate(Math.PI / 2))
    .modulateScale(osc(rnd_btw(0.45, 1.1)), () => 0.35 + a.fft[0] * 1.0)
    .pixelate(p, p)
    .add(src(o0).scale(1.007).luma(0.05).colorama(0.016), 0.62)
    .add(noise(7, 0.24).thresh(() => 0.95 - a.fft[3] * 0.2).pixelate(p * 2, p * 2), 0.38)
    .modulate(noise(0.5).pixelate(2, 120), () => 0.003 + a.fft[2] * 0.018)
    .color(rnd_btw(0.95, 1.65), rnd_btw(0.45, 1.1), rnd_btw(0.25, 0.9))
    .out();

  speed = 0.09;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
