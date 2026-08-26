// ds_05_binary_pendulum - crossing two-sided strokes posterized into hard pixels
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

  let swing = rnd_btw(0.5, 1.4);
  let p = rnd_int(34, 88);
  let tone = rnd_btw(0.7, 1.4);

  shape(2, () => 0.08 + a.fft[0] * 0.16, 0.001)
    .scale(1.9, 0.34)
    .rotate(() => Math.sin(time * swing) * 0.8)
    .add(
      shape(2, () => 0.08 + a.fft[1] * 0.18, 0.001)
        .scale(1.9, 0.34)
        .rotate(() => -Math.sin(time * swing * 0.83) * 0.8),
      0.9,
    )
    .mult(osc(rnd_btw(18, 44), 0.02, 0.8).thresh(() => 0.45 - a.fft[0] * 0.15))
    .diff(src(o0).scale(1.01).rotate(() => 0.004 + a.fft[2] * 0.02).luma(0.2), 0.45)
    .pixelate(p, p)
    .posterize(2, 0.55)
    .add(noise(rnd_btw(3, 7), 0.35).thresh(0.88).pixelate(p * 2, p), () => a.fft[3] * 0.65)
    .modulateRotate(osc(rnd_btw(3, 8)), () => a.fft[1] * 0.35)
    .color(tone, rnd_btw(0.35, 0.85), rnd_btw(0.8, 1.6))
    .colorama(() => 0.025 + a.fft[0] * 0.18)
    .out();

  speed = 0.28;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
