// ds_04_twin_scan_rift - left/right scanline rift with asynchronous tear offsets
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

  let scan = rnd_int(260, 520);
  let split = rnd_btw(0.12, 0.28);
  let burn = rnd_btw(0.003, 0.009);
  let drift = rnd_btw(0.004, 0.012);

  osc(scan, 0, 0)
    .rotate(Math.PI / 2)
    .thresh(() => 0.35 + a.fft[0] * 0.18)
    .luma(0.7)
    .mult(osc(rnd_btw(7, 18), 0.05, 1.1))
    .diff(osc(scan * 0.5, 0, 0).rotate(Math.PI / 2).scrollX(() => split + a.fft[1] * 0.08))
    .modulate(noise(1.1, 0.2).pixelate(700, 4), () => drift + a.fft[2] * 0.035)
    .add(src(o0).scrollX(() => -burn - a.fft[0] * 0.01).color(1.4, 0.35, 0.6), 0.32)
    .add(src(o0).scrollX(() => burn + a.fft[1] * 0.01).color(0.35, 0.9, 1.45), 0.32)
    .scale(() => 1.001 + a.fft[0] * 0.008)
    .pixelate(rnd_int(90, 180), rnd_int(120, 260))
    .posterize(rnd_int(4, 7), 0.25)
    .colorama(() => 0.015 + a.fft[3] * 0.25)
    .out();

  speed = 0.55;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
