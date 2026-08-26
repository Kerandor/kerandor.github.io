// ds_06_stereo_bitfield - mirrored bitfields using separate audio bands
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

  let cells = rnd_int(18, 52);
  let freq = rnd_btw(45, 140);
  let phase = rnd_btw(0.3, 0.8);

  osc(freq, 0, 1)
    .thresh(() => 0.48 - a.fft[0] * 0.22)
    .pixelate(cells, cells)
    .repeat(2, 1)
    .diff(
      osc(freq * phase, 0, 1)
        .rotate(Math.PI)
        .thresh(() => 0.5 - a.fft[2] * 0.22)
        .pixelate(cells, cells)
        .scrollX(0.5),
    )
    .modulateRepeat(noise(2, 0.4).pixelate(4, 4), () => 0.05 + a.fft[1] * 0.25, rnd_int(4, 12))
    .add(src(o0).scale(1.002).posterize(3, 0.5), () => 0.45 + a.fft[0] * 0.25)
    .modulate(noise(0.7).pixelate(2, 80), () => 0.003 + a.fft[3] * 0.02)
    .color(rnd_btw(0.6, 1.3), rnd_btw(0.9, 1.5), rnd_btw(0.5, 1.2))
    .saturate(() => 0.8 + a.fft[0] * 2)
    .colorama(() => 0.01 + a.fft[3] * 0.3)
    .out();

  speed = 0.12;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
