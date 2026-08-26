// ds_01_split_carrier - opposed carrier halves with audio-opened pixel fuzz
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

  let carrier = rnd_btw(55, 180);
  let gapFreq = rnd_btw(0.07, 0.22);
  let p = rnd_int(42, 96);
  let tear = rnd_btw(0.004, 0.012);

  osc(carrier, 0.015, 0.9)
    .rotate(Math.PI / 2)
    .modulate(osc(rnd_btw(2, 5)).rotate(Math.PI / 2), () => 0.08 + a.fft[0] * 0.3)
    .diff(osc(carrier * 0.5, 0.02, 1.1).rotate(-Math.PI / 2))
    .mult(shape(2, () => 0.18 + a.fft[0] * 0.35, 0.001).scale(1.8, 0.72))
    .pixelate(p, p)
    .posterize(rnd_int(3, 5), 0.35)
    .add(noise(9, 0.4).thresh(() => 0.86 - a.fft[3] * 0.25).pixelate(p, p), 0.45)
    .scrollX(() => Math.sin(time * gapFreq) * 0.02)
    .modulate(noise(0.8).pixelate(3, 140), () => tear + a.fft[1] * 0.025)
    .blend(src(o0).scale(1.003).colorama(0.01), () => 0.52 + a.fft[0] * 0.18)
    .color(rnd_btw(0.7, 1.3), rnd_btw(0.45, 1), rnd_btw(0.9, 1.5))
    .colorama(() => 0.02 + a.fft[2] * 0.25)
    .out();

  speed = 0.22;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
