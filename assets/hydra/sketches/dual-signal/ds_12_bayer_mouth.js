// ds_12_bayer_mouth - audio mouth mask filled with dither storm
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

  let p = rnd_int(80, 180);
  let teeth = rnd_int(8, 18);
  let storm = rnd_btw(24, 60);

  shape(2, () => 0.08 + a.fft[0] * 0.42, 0.001)
    .scale(1.7, 0.42)
    .add(shape(2, () => 0.08 + a.fft[1] * 0.35, 0.001).scale(1.7, 0.42).rotate(Math.PI), 0.8)
    .mult(noise(storm, 0.15).thresh(() => 0.48 - a.fft[2] * 0.2).pixelate(p, p))
    .add(osc(teeth, 0, 0).rotate(Math.PI / 2).thresh(0.52).pixelate(p, p), () => 0.22 + a.fft[3] * 0.45)
    .modulateRepeat(osc(rnd_btw(3, 7)).rotate(Math.PI / 2), () => 0.04 + a.fft[0] * 0.18, rnd_int(4, 10))
    .blend(src(o0).scale(1.006).luma(0.1).colorama(0.02), () => 0.4 + a.fft[0] * 0.25)
    .posterize(2, 0.65)
    .modulate(noise(0.9).pixelate(3, 180), () => 0.006 + a.fft[1] * 0.03)
    .color(rnd_btw(0.9, 1.5), rnd_btw(0.4, 0.95), rnd_btw(0.7, 1.4))
    .out();

  speed = 0.16;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
