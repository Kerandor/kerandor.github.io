// dsf_18_bitfield_halo - mirrored bitfields with a glowing center halo
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

  let cells = rnd_int(18, 50);
  let freq = rnd_btw(55, 150);

  osc(freq, 0, 1).thresh(() => 0.5 - a.fft[0] * 0.22).pixelate(cells, cells).repeat(2, 1)
    .diff(osc(freq * rnd_btw(0.34, 0.78), 0, 1).rotate(Math.PI).thresh(() => 0.5 - a.fft[2] * 0.22).pixelate(cells, cells).scrollX(0.5))
    .mult(shape(2, () => 0.35 + a.fft[0] * 0.18, 0.001).scale(1.9, 1.15).rotate(Math.PI / 2))
    .add(shape(2, () => 0.04 + a.fft[0] * 0.1, 0.02).scale(0.4, 1.8).color(1.3, 0.8, 0.35), () => 0.25 + a.fft[0] * 0.5)
    .modulateRepeat(noise(2, 0.35).pixelate(3, 3), () => 0.04 + a.fft[1] * 0.22, rnd_int(4, 11))
    .add(src(o0).scale(1.004).luma(0.06).colorama(0.018), 0.52)
    .modulate(noise(0.7).pixelate(2, 90), () => 0.003 + a.fft[3] * 0.02)
    .color(rnd_btw(0.55, 1.25), rnd_btw(0.85, 1.45), rnd_btw(0.45, 1.25))
    .out();

  speed = 0.11;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
