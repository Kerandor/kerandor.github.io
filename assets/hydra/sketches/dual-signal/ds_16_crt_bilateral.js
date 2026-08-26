// ds_16_crt_bilateral - two-panel CRT phosphor with scanline burn
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

  o0.setMode("linear");
  fps = 30;

  let scanLines = rnd_int(320, 620);
  let freq = rnd_btw(50, 140);
  let feedback = rnd_btw(0.004, 0.01);

  osc(freq, 0.02, 1.2)
    .modulateScale(osc(rnd_btw(3, 7)).rotate(Math.PI / 2), () => a.fft[0] * 0.5)
    .diff(osc(freq * 0.8, 0.02, 1.2).rotate(Math.PI).scrollX(0.14))
    .mult(osc(scanLines, 0, 0).rotate(Math.PI / 2).thresh(0.38).luma(0.65).add(solid(0.32)))
    .mult(shape(2, () => 0.3 + a.fft[0] * 0.18, 0.001).scale(1.9, 1.15).rotate(Math.PI / 2))
    .modulate(src(o0), feedback)
    .add(src(o0).scale(1.003).luma(0.05).colorama(0.018), 0.56)
    .modulate(noise(1.1, 0.06).pixelate(600, 2), () => 0.005 + a.fft[1] * 0.02)
    .color(rnd_btw(0.25, 0.55), rnd_btw(0.85, 1.25), rnd_btw(0.25, 0.7))
    .hue(() => Math.sin(time * 0.07) * 0.12 + a.fft[2] * 0.28)
    .out();

  speed = 1.2;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
