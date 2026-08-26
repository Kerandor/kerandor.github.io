// ds_03_wide_osc_columns - spaced vertical oscillator columns crushed into blocks
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

  let cols = rnd_int(3, 8);
  let columnFreq = rnd_btw(1.4, 3.8);
  let carrier = rnd_btw(30, 95);
  let pX = rnd_int(18, 42);
  let pY = rnd_int(90, 190);

  osc(columnFreq, 0.02, 0.5)
    .rotate(Math.PI / 2)
    .thresh(() => 0.58 - a.fft[1] * 0.28)
    .repeat(cols, 1)
    .mult(osc(carrier, 0.005, 1.2).rotate(Math.PI / 2).color(1, 0.7, 1.3))
    .modulateScale(osc(rnd_btw(0.3, 0.7)).rotate(Math.PI / 2), () => 0.8 + a.fft[0] * 1.8)
    .modulate(noise(0.45).pixelate(2, pY), () => 0.006 + a.fft[2] * 0.028)
    .pixelate(pX, pY)
    .add(noise(rnd_btw(5, 12), 0.25).thresh(0.9).pixelate(pX * 2, pY), () => 0.25 + a.fft[3] * 0.5)
    .blend(src(o0).scrollY(() => 0.001 + a.fft[1] * 0.008).scale(0.998), 0.48)
    .posterize(rnd_int(2, 5), 0.45)
    .color(rnd_btw(0.6, 1.2), rnd_btw(0.6, 1.4), rnd_btw(0.7, 1.5))
    .hue(() => Math.sin(time * 0.06) * 0.18 + a.fft[2] * 0.25)
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
