// ds_09_dual_voronoi_static - mirrored cell static around a central axis
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

  let cells = rnd_int(18, 58);
  let p = rnd_int(60, 150);
  let slide = rnd_btw(0.04, 0.12);

  voronoi(cells, () => 0.05 + a.fft[3] * 0.8, rnd_btw(2, 6))
    .thresh(() => 0.45 - a.fft[0] * 0.18)
    .scale(0.92, 1.3)
    .scrollX(() => -slide * 0.2)
    .diff(
      voronoi(cells, () => 0.05 + a.fft[2] * 0.8, rnd_btw(2, 6))
        .thresh(() => 0.45 - a.fft[1] * 0.18)
        .scale(0.92, 1.3)
        .scrollX(() => slide * 0.2),
    )
    .pixelate(p, p)
    .sub(shape(2, 0.36, 0.001).scale(1.8, 1.15))
    .modulatePixelate(noise(1.2, 0.25), () => 8 + a.fft[0] * 90)
    .diff(src(o0).scale(1.001).colorama(0.02), () => 0.45 + a.fft[1] * 0.22)
    .add(
      osc(rnd_btw(180, 360), 0, 0)
        .rotate(Math.PI / 2)
        .thresh(0.55),
      0.12,
    )
    .color(rnd_btw(0.7, 1.4), rnd_btw(0.7, 1.4), rnd_btw(0.7, 1.4))
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] =
    "pixelated";
})();
