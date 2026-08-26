// ds_14_shard_mirror - mirrored shards with audio-rotated glitch mosaic
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

  let shards = rnd_int(3, 6);
  let p = rnd_int(38, 96);
  let scatter = rnd_btw(0.05, 0.18);

  shape(shards, 0.28, 0.001)
    .scale(0.8, 1.65)
    .rotate(() => time * 0.05 + a.fft[2] * 1.2)
    .scrollX(-scatter)
    .diff(shape(shards, 0.28, 0.001).scale(0.8, 1.65).rotate(() => -time * 0.05 - a.fft[1] * 1.2).scrollX(scatter))
    .mult(voronoi(rnd_int(12, 30), 0.15, rnd_btw(2, 5)).thresh(() => 0.35 - a.fft[0] * 0.12))
    .modulateRotate(osc(rnd_btw(5, 11)), () => 0.15 + a.fft[0] * 0.5)
    .modulatePixelate(noise(3, 0.3), () => 10 + a.fft[3] * 110)
    .pixelate(p, p)
    .add(src(o0).scale(0.995).rotate(0.006).colorama(0.015), 0.46)
    .add(noise(20, 0.35).thresh(0.96).pixelate(p * 2, p * 2), () => 0.15 + a.fft[3] * 0.45)
    .color(rnd_btw(0.6, 1.3), rnd_btw(0.7, 1.4), rnd_btw(0.9, 1.6))
    .out();

  speed = 0.2;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
