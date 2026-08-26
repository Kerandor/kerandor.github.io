// dsf_13_hinge_bitcrush - folding panels filled with binary threshold noise
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let hinge = rnd_btw(0.35, 0.9);
  let p = rnd_int(36, 90);

  shape(rnd_int(3, 5), () => 0.27 + a.fft[0] * 0.28, 0.001).scale(0.85, 1.8).scrollX(-0.22).rotate(() => -hinge * (0.25 + a.fft[0]))
    .add(shape(rnd_int(3, 5), () => 0.27 + a.fft[0] * 0.28, 0.001).scale(0.85, 1.8).scrollX(0.22).rotate(() => hinge * (0.25 + a.fft[0])), 0.95)
    .mult(noise(rnd_btw(18, 42), 0.2).thresh(() => 0.5 - a.fft[1] * 0.22).pixelate(p, p))
    .mult(osc(rnd_btw(12, 28), 0.02, 0.7).rotate(Math.PI / 2))
    .modulateScale(noise(1.6, 0.18), () => 0.06 + a.fft[1] * 0.45)
    .pixelate(p, p)
    .posterize(2, 0.7)
    .add(src(o0).scale(() => 1.004 + a.fft[0] * 0.009).luma(0.12), 0.42)
    .modulate(noise(0.6).pixelate(260, 3), () => 0.004 + a.fft[2] * 0.024)
    .color(rnd_btw(0.85, 1.45), rnd_btw(0.35, 0.9), rnd_btw(0.7, 1.35))
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
