// dsf_11_tape_switchback - bilateral tape bends with left/right phase jumps
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
  o0.setMode("linear");
  fps = 30;

  let carrier = rnd_btw(18, 44);
  let roll = rnd_btw(0.12, 0.36);

  osc(carrier, 0.018, 1)
    .rotate(Math.PI / 2)
    .modulate(
      noise(1.1, 0.16).pixelate(500, rnd_int(5, 12)),
      () => 0.025 + a.fft[1] * 0.075,
    )
    .diff(
      osc(carrier * 0.78, 0.018, 1)
        .rotate(-Math.PI / 2)
        .scrollX(() => Math.sin(time * roll) * 0.055 + a.fft[0] * 0.04),
    )
    .mult(
      shape(2, () => 0.34 + a.fft[0] * 0.2, 0.001)
        .scale(1.8, 1)
        .rotate(Math.PI / 2),
    )
    .pixelate(rnd_int(90, 180), rnd_int(8, 24))
    .add(
      src(o0)
        .scrollY(() => 0.002 + a.fft[0] * 0.01)
        .scale(1.002)
        .color(1.35, 0.45, 0.62),
      0.32,
    )
    .add(
      src(o0)
        .scrollY(() => -0.002 - a.fft[2] * 0.01)
        .scale(0.999)
        .color(0.42, 0.9, 1.35),
      0.26,
    )
    .modulate(noise(0.55).pixelate(2, 220), () => 0.004 + a.fft[3] * 0.028)
    .hue(() => Math.sin(time * 0.05) * 0.12 + a.fft[1] * 0.22)
    .out();

  speed = 0.34;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
