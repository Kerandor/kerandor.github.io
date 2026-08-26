// ds_02_mirror_gate - bilateral gate snapping open on bass hits
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
    return (
      Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a)
    );
  }

  o0.setMode("nearest");
  fps = 30;

  let sides = rnd_int(2, 4);
  let gateFreq = rnd_btw(7, 18);
  let gatePulse = rnd_btw(0.15, 0.35);
  let p = rnd_int(28, 72);

  shape(sides, () => 0.22 + a.fft[0] * 0.48, 0.002)
    .scale(1.4, 0.65)
    .rotate(() => Math.sin(time * 0.4) * 0.08)
    .diff(
      shape(sides, () => 0.2 + a.fft[0] * 0.42, 0.002)
        .scale(1.4, 0.65)
        .rotate(Math.PI),
    )
    .mult(osc(gateFreq, 0.02, 0.8).thresh(() => 0.45 - a.fft[0] * 0.25))
    .modulateScale(
      osc(2, 0.04).rotate(Math.PI / 2),
      () => gatePulse + a.fft[1] * 0.7,
    )
    .add(
      osc(gateFreq * 4, 0, 0)
        .rotate(Math.PI / 2)
        .thresh(0.5)
        .luma(0.7),
      0.18,
    )
    .pixelate(p, p)
    .modulatePixelate(noise(0.3, 0.35), () => 18 + a.fft[2] * 80)
    .add(
      src(o0)
        .scrollX(() => -0.002 - a.fft[1] * 0.01)
        .color(1.2, 0.4, 0.7),
      0.35,
    )
    .add(
      src(o0)
        .scrollX(() => 0.002 + a.fft[2] * 0.01)
        .color(0.45, 0.8, 1.4),
      0.28,
    )
    .posterize(rnd_int(3, 6), 0.4)
    .colorama(() => 0.04 + a.fft[3] * 0.35)
    .out();

  speed = 0.32;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] =
    "pixelated";
})();
