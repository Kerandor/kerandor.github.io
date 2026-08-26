// ds_08_gap_oscillator - sparse oscillator gaps widened by audio
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

  let sparse = rnd_btw(0.45, 1.2);
  let carrier = rnd_btw(70, 180);
  let pX = rnd_int(12, 36);
  let pY = rnd_int(28, 84);

  osc(sparse, 0.01, 0.4)
    .thresh(() => 0.72 - a.fft[0] * 0.38)
    .mult(osc(carrier, 0.012, 1.2).rotate(Math.PI / 2))
    .diff(
      osc(sparse * 1.5, 0.01, 0.4)
        .rotate(Math.PI)
        .thresh(() => 0.72 - a.fft[1] * 0.35),
    )
    .scale(() => 0.85 + a.fft[0] * 0.45, 1.1)
    .modulate(noise(0.35, 0.1).pixelate(2, pY), () => 0.005 + a.fft[2] * 0.04)
    .pixelate(pX, pY)
    .posterize(rnd_int(2, 4), 0.55)
    .add(
      src(o0)
        .scrollX(() => Math.sin(time * 0.15) * 0.003)
        .scale(0.997),
      0.42,
    )
    .add(
      noise(rnd_btw(8, 18), 0.5)
        .thresh(0.94)
        .pixelate(pX * 2, pY),
      () => a.fft[3] * 0.7,
    )
    .color(rnd_btw(0.45, 1.1), rnd_btw(0.8, 1.5), rnd_btw(0.9, 1.6))
    .colorama(() => 0.02 + a.fft[1] * 0.22)
    .out();

  speed = 0.08;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] =
    "pixelated";
})();
