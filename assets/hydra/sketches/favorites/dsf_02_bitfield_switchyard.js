// dsf_02_bitfield_switchyard - mirrored bit planes rerouted by audio bands
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

  let cells = rnd_int(16, 46);
  let freq = rnd_btw(50, 155);
  let repeat = rnd_int(3, 9);

  osc(freq, 0, 1)
    .thresh(() => 0.52 - a.fft[0] * 0.24)
    .pixelate(cells, cells)
    .repeat(repeat, 1)
    .diff(osc(freq * rnd_btw(0.35, 0.78), 0, 1).rotate(Math.PI).thresh(() => 0.5 - a.fft[2] * 0.24).pixelate(cells, cells).repeat(repeat, 1).scrollX(0.5))
    .modulateRepeat(noise(2, 0.35).pixelate(3, 3), () => 0.04 + a.fft[1] * 0.25, rnd_int(5, 13))
    .mult(shape(2, () => 0.36 + a.fft[0] * 0.16, 0.001).scale(1.9, 1.2).rotate(Math.PI / 2))
    .add(src(o0).scale(1.002).posterize(3, 0.5).colorama(0.012), () => 0.4 + a.fft[0] * 0.26)
    .modulate(noise(0.7).pixelate(2, 90), () => 0.003 + a.fft[3] * 0.022)
    .color(rnd_btw(0.55, 1.3), rnd_btw(0.85, 1.5), rnd_btw(0.45, 1.25))
    .saturate(() => 0.8 + a.fft[4] * 2.2)
    .out();

  speed = 0.1;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
