// ds_10_tape_symmetry - bilateral tape wobble with chromatic ghost feedback
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

  let roll = rnd_btw(0.15, 0.45);
  let bars = rnd_int(4, 10);
  let carrier = rnd_btw(18, 45);

  osc(carrier, 0.02, 1)
    .rotate(Math.PI / 2)
    .modulate(noise(1.4, 0.18).pixelate(500, bars), () => 0.03 + a.fft[1] * 0.08)
    .diff(osc(carrier * 0.8, 0.02, 1).rotate(-Math.PI / 2).scrollX(() => Math.sin(time * roll) * 0.045))
    .mult(osc(rnd_btw(90, 180), 0, 0).rotate(Math.PI / 2).thresh(0.45).add(solid(0.35)))
    .pixelate(rnd_int(80, 170), rnd_int(8, 26))
    .add(src(o0).scrollY(() => 0.002 + a.fft[0] * 0.012).scale(1.002).color(1.35, 0.45, 0.65), 0.35)
    .add(src(o0).scrollY(() => -0.002 - a.fft[2] * 0.012).scale(0.999).color(0.45, 0.9, 1.35), 0.28)
    .modulate(noise(0.55).pixelate(2, 240), () => 0.004 + a.fft[3] * 0.03)
    .hue(() => Math.sin(time * 0.05) * 0.12 + a.fft[1] * 0.25)
    .colorama(rnd_btw(0.01, 0.035))
    .out();

  speed = 0.35;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
