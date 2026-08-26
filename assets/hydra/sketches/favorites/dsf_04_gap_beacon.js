// dsf_04_gap_beacon - wide oscillator gaps pulsing as twin beacons
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let sparse = rnd_btw(0.35, 1);
  let pX = rnd_int(14, 38);
  let pY = rnd_int(34, 90);

  osc(sparse, 0.01, 0.35)
    .thresh(() => 0.76 - a.fft[0] * 0.44)
    .scrollX(-0.18)
    .add(osc(sparse * 1.21, 0.01, 0.35).rotate(Math.PI).thresh(() => 0.76 - a.fft[1] * 0.4).scrollX(0.18), 0.95)
    .mult(osc(rnd_btw(80, 190), 0.008, 1.15).rotate(Math.PI / 2))
    .scale(() => 0.82 + a.fft[0] * 0.5, 1.1)
    .pixelate(pX, pY)
    .posterize(rnd_int(2, 4), 0.58)
    .add(src(o0).scale(1.006).luma(0.05).colorama(0.018), 0.58)
    .add(noise(10, 0.4).thresh(0.94).pixelate(pX * 2, pY), () => a.fft[3] * 0.62)
    .modulate(noise(0.4).pixelate(2, pY * 2), () => 0.004 + a.fft[2] * 0.028)
    .color(rnd_btw(0.9, 1.6), rnd_btw(0.45, 1.15), rnd_btw(0.25, 0.95))
    .out();

  speed = 0.08;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
