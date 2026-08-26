// ds_18_square_wave_fault - two-sided square-wave fields shearing on peaks
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

  let square = rnd_btw(9, 28);
  let p = rnd_int(36, 96);
  let shear = rnd_btw(0.03, 0.08);

  osc(square, 0, 0.8)
    .thresh(() => 0.46 - a.fft[0] * 0.18)
    .scrollX(() => -shear * Math.sin(time * 0.5) - a.fft[0] * 0.08)
    .diff(osc(square * 1.5, 0, 0.8).rotate(Math.PI).thresh(() => 0.46 - a.fft[1] * 0.18).scrollX(() => shear * Math.sin(time * 0.47) + a.fft[1] * 0.08))
    .modulateScrollY(osc(rnd_btw(2, 5)).rotate(Math.PI / 2), () => 0.02 + a.fft[2] * 0.18)
    .pixelate(p, p)
    .posterize(2, 0.55)
    .add(src(o0).scrollX(() => 0.003 + a.fft[2] * 0.016).scale(1.003), 0.5)
    .add(noise(rnd_btw(12, 26), 0.3).thresh(0.94).pixelate(p, p), () => 0.2 + a.fft[3] * 0.45)
    .modulate(noise(0.6).pixelate(260, 4), () => 0.005 + a.fft[0] * 0.02)
    .color(rnd_btw(0.9, 1.5), rnd_btw(0.45, 1), rnd_btw(0.7, 1.4))
    .out();

  speed = 0.15;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
