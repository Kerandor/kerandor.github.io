// ds_11_cross_phase_pixels - opposing oscillators cross-modulated into blocks
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

  a.setBins(8);
  o0.setMode("nearest");
  fps = 30;

  let xFreq = rnd_btw(5, 16);
  let yFreq = rnd_btw(5, 16);
  let p = rnd_int(28, 70);

  osc(xFreq, 0.04, 0.8)
    .modulate(
      osc(yFreq, 0.02).rotate(Math.PI / 2),
      () => 0.15 + a.fft[1] * 0.55,
    )
    .diff(
      osc(yFreq, 0.04, 0.8)
        .rotate(Math.PI / 2)
        .modulate(osc(xFreq, 0.02), () => 0.15 + a.fft[2] * 0.55),
    )
    .mult(
      shape(2, () => 0.28 + a.fft[0] * 0.24, 0.001)
        .scale(1.7, 1.1)
        .rotate(Math.PI / 2),
    )
    .modulateScale(noise(2, 0.2), () => 0.12 + a.fft[0] * 0.65)
    .pixelate(p, p)
    .posterize(rnd_int(3, 6), 0.35)
    .add(
      src(o0)
        .rotate(() => 0.002 + a.fft[3] * 0.012)
        .scale(1.004),
      0.42,
    )
    .add(
      noise(rnd_btw(10, 22), 0.35)
        .thresh(0.94)
        .pixelate(p * 2, p * 2),
      0.35,
    )
    .color(rnd_btw(0.6, 1.2), rnd_btw(0.45, 1.2), rnd_btw(1, 1.7))
    .colorama(() => 0.02 + a.fft[3] * 0.28)
    .out();

  speed = 0.24;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] =
    "pixelated";
})();
