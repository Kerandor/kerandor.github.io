// ds_13_sync_lantern - sparse twin pulses leaving glowing pixel trails
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

  let pulse = rnd_btw(0.25, 0.7);
  let carrier = rnd_btw(12, 34);
  let p = rnd_int(26, 64);

  osc(pulse, 0.01, 0.2)
    .thresh(() => 0.78 - a.fft[0] * 0.42)
    .scrollX(-0.2)
    .add(osc(pulse * 1.13, 0.01, 0.2).thresh(() => 0.78 - a.fft[1] * 0.4).scrollX(0.2), 0.95)
    .mult(osc(carrier, 0.01, 1.2).rotate(Math.PI / 2))
    .modulateScale(osc(rnd_btw(0.5, 1.2)), () => 0.4 + a.fft[0] * 1.2)
    .pixelate(p, p)
    .add(src(o0).scale(1.008).luma(0.05).colorama(0.018), 0.62)
    .add(noise(7, 0.2).thresh(() => 0.95 - a.fft[3] * 0.2).pixelate(p * 2, p * 2), 0.4)
    .modulate(noise(0.5).pixelate(2, 120), () => 0.003 + a.fft[2] * 0.018)
    .color(rnd_btw(0.9, 1.6), rnd_btw(0.45, 1.1), rnd_btw(0.25, 0.85))
    .saturate(() => 0.9 + a.fft[0] * 2.5)
    .out();

  speed = 0.1;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
