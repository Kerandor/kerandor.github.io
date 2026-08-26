// ds_07_bass_hinge - two hinged panels folding with low-end audio
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2)
      .fill()
      .map(() =>
        this.regl.framebuffer({
          color: this.regl.texture({
            mag: mode,
            min: mode,
            width: width,
            height: height,
            format: "rgba",
          }),
          depthStencil: false,
        }),
      );
  };

  function rnd_btw(a, b) {
    return fxrand() * (b - a) + a;
  }

  function rnd_int(a, b) {
    return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a);
  }

  o0.setMode("nearest");
  fps = 30;

  let hinge = rnd_btw(0.35, 0.9);
  let panel = rnd_int(3, 5);
  let p = rnd_int(40, 110);

  shape(panel, () => 0.26 + a.fft[0] * 0.32, 0.001)
    .scale(0.9, 1.8)
    .scrollX(() => -0.2 - a.fft[0] * 0.12)
    .rotate(() => -hinge * (0.25 + a.fft[0]))
    .add(
      shape(panel, () => 0.26 + a.fft[0] * 0.32, 0.001)
        .scale(0.9, 1.8)
        .scrollX(() => 0.2 + a.fft[0] * 0.12)
        .rotate(() => hinge * (0.25 + a.fft[0])),
      0.95,
    )
    .mult(osc(rnd_btw(12, 26), 0.03, 0.6).rotate(Math.PI / 2))
    .modulateScale(noise(1.8, 0.2), () => 0.08 + a.fft[1] * 0.55)
    .pixelate(p, p)
    .add(src(o0).scale(() => 1.005 + a.fft[0] * 0.01).colorama(0.018), 0.48)
    .add(noise(16, 0.2).thresh(() => 0.92 - a.fft[3] * 0.18).pixelate(p, p), 0.4)
    .modulate(noise(0.6).pixelate(260, 3), () => 0.004 + a.fft[2] * 0.025)
    .color(rnd_btw(0.8, 1.4), rnd_btw(0.35, 1.1), rnd_btw(0.55, 1.3))
    .out();

  speed = 0.2;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
