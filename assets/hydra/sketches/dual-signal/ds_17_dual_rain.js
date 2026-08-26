// ds_17_dual_rain - mirrored pixel rain lanes with audio sparkle
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

  let lanes = rnd_int(6, 16);
  let p = rnd_int(70, 160);
  let fall = rnd_btw(0.12, 0.35);

  voronoi(rnd_int(24, 55), 0.35, rnd_btw(2, 5))
    .repeat(lanes, 1)
    .scrollY(() => time * fall + a.fft[0] * 0.04)
    .diff(voronoi(rnd_int(24, 55), 0.35, rnd_btw(2, 5)).repeat(lanes, 1).scrollY(() => -time * fall * 0.8 - a.fft[1] * 0.04))
    .mult(shape(2, 0.38, 0.001).scale(1.7, 1.35).rotate(Math.PI / 2))
    .pixelate(p, p)
    .posterize(rnd_int(3, 5), 0.3)
    .add(noise(8, 0.5).thresh(() => 0.92 - a.fft[3] * 0.22).scrollY(() => time * fall * 2).pixelate(p, p), 0.55)
    .add(src(o0).scrollY(() => 0.004 + a.fft[0] * 0.012).scale(0.999).colorama(0.012), 0.58)
    .modulate(noise(0.8).pixelate(3, 180), () => 0.004 + a.fft[2] * 0.024)
    .color(rnd_btw(0.45, 1.2), rnd_btw(0.8, 1.5), rnd_btw(0.7, 1.4))
    .out();

  speed = 0.28;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
