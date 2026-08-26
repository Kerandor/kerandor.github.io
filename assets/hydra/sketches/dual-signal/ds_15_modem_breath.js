// ds_15_modem_breath - breathing split with thin modem-carrier sync loss
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

  a.setBins(8);
  o0.setMode("nearest");
  fps = 30;

  let carrier = rnd_btw(140, 340);
  let breath = rnd_btw(0.05, 0.16);
  let p = rnd_int(90, 210);

  osc(carrier, 0.003, 1.1)
    .rotate(Math.PI / 2)
    .thresh(() => 0.5 - a.fft[0] * 0.18)
    .mult(shape(2, () => 0.2 + Math.sin(time * breath) * 0.08 + a.fft[0] * 0.24, 0.001).scale(1.8, 0.8))
    .diff(osc(carrier * 0.67, 0.004, 1.1).rotate(-Math.PI / 2).thresh(() => 0.5 - a.fft[1] * 0.16))
    .modulate(noise(0.35, 0.08).pixelate(2, 300), () => 0.002 + a.fft[2] * 0.03)
    .scrollY(() => Math.sin(time * breath * 2) * 0.01 + a.fft[3] * 0.015)
    .pixelate(p, rnd_int(24, 64))
    .add(src(o0).scrollX(() => 0.002 + a.fft[0] * 0.012).scale(1.001), 0.4)
    .posterize(2, 0.55)
    .color(rnd_btw(0.7, 1.1), rnd_btw(0.9, 1.5), rnd_btw(0.8, 1.4))
    .colorama(() => 0.01 + a.fft[4] * 0.35)
    .out();

  speed = 0.09;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
