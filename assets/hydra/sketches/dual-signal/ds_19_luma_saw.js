// ds_19_luma_saw - wide sawtooth mask with luma feedback and harsh quantization
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

  let saw = rnd_btw(1.5, 4.5);
  let carrier = rnd_btw(30, 90);
  let p = rnd_int(44, 110);

  gradient(1)
    .repeat(rnd_int(2, 5), 1)
    .thresh(() => 0.54 - a.fft[0] * 0.3)
    .modulate(osc(saw, 0.02, 0.8), () => 0.08 + a.fft[1] * 0.24)
    .diff(gradient(1).rotate(Math.PI).repeat(rnd_int(2, 5), 1).thresh(() => 0.54 - a.fft[2] * 0.25))
    .mult(osc(carrier, 0.01, 1.2).rotate(Math.PI / 2))
    .pixelate(p, p)
    .posterize(rnd_int(2, 4), 0.65)
    .add(src(o0).luma(() => 0.08 + a.fft[0] * 0.2).scale(1.006).colorama(0.016), 0.5)
    .modulatePixelate(noise(2, 0.2), () => 12 + a.fft[3] * 100)
    .modulate(noise(0.45).pixelate(2, 180), () => 0.004 + a.fft[1] * 0.03)
    .color(rnd_btw(0.6, 1.3), rnd_btw(0.8, 1.5), rnd_btw(0.45, 1.2))
    .out();

  speed = 0.12;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
