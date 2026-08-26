// dsf_03_hinge_terminal - folding panels over a terminal carrier
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let panel = rnd_int(3, 5);
  let hinge = rnd_btw(0.35, 0.85);
  let p = rnd_int(42, 100);

  shape(panel, () => 0.24 + a.fft[0] * 0.32, 0.001)
    .scale(0.82, 1.8).scrollX(() => -0.22 - a.fft[0] * 0.1).rotate(() => -hinge * (0.25 + a.fft[0]))
    .add(shape(panel, () => 0.24 + a.fft[0] * 0.32, 0.001).scale(0.82, 1.8).scrollX(() => 0.22 + a.fft[0] * 0.1).rotate(() => hinge * (0.25 + a.fft[0])), 0.95)
    .mult(osc(rnd_btw(38, 88), 0.01, 1).rotate(Math.PI / 2).thresh(() => 0.42 - a.fft[1] * 0.14))
    .modulateScale(noise(1.5, 0.18), () => 0.07 + a.fft[1] * 0.48)
    .pixelate(p, p)
    .add(osc(rnd_btw(160, 280), 0, 0).rotate(Math.PI / 2).thresh(0.48).pixelate(p, 3), 0.18)
    .add(src(o0).scale(() => 1.004 + a.fft[0] * 0.009).colorama(0.015), 0.48)
    .add(noise(15, 0.2).thresh(() => 0.93 - a.fft[3] * 0.18).pixelate(p, p), 0.36)
    .color(rnd_btw(0.75, 1.35), rnd_btw(0.45, 1.15), rnd_btw(0.55, 1.35))
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
