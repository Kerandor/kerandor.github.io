// dsf_06_cross_phase_gate - cross-phase oscillators crushed through a gate
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

  let xFreq = rnd_btw(5, 17);
  let yFreq = rnd_btw(5, 17);
  let p = rnd_int(26, 72);

  osc(xFreq, 0.035, 0.8)
    .modulate(osc(yFreq, 0.018).rotate(Math.PI / 2), () => 0.14 + a.fft[1] * 0.55)
    .diff(osc(yFreq, 0.035, 0.8).rotate(Math.PI / 2).modulate(osc(xFreq, 0.018), () => 0.14 + a.fft[2] * 0.55))
    .mult(shape(2, () => 0.24 + a.fft[0] * 0.3, 0.001).scale(1.65, 0.9))
    .modulateScale(noise(2, 0.2), () => 0.1 + a.fft[0] * 0.62)
    .pixelate(p, p)
    .posterize(rnd_int(3, 6), 0.38)
    .add(src(o0).rotate(() => 0.002 + a.fft[3] * 0.012).scale(1.004), 0.42)
    .add(noise(rnd_btw(10, 22), 0.35).thresh(0.94).pixelate(p * 2, p * 2), 0.32)
    .color(rnd_btw(0.6, 1.2), rnd_btw(0.45, 1.2), rnd_btw(1, 1.7))
    .colorama(() => 0.018 + a.fft[4] * 0.3)
    .out();

  speed = 0.22;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
