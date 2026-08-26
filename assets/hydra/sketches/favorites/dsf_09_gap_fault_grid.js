// dsf_09_gap_fault_grid - sparse gaps fractured by square-wave grid faults
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("nearest");
  fps = 30;

  let gap = rnd_btw(0.45, 1.15);
  let grid = rnd_btw(8, 22);
  let p = rnd_int(24, 66);

  osc(gap, 0.01, 0.38).thresh(() => 0.74 - a.fft[0] * 0.4)
    .diff(osc(gap * 1.6, 0.01, 0.38).rotate(Math.PI).thresh(() => 0.74 - a.fft[1] * 0.36))
    .mult(osc(grid, 0, 0.8).thresh(0.48).diff(osc(grid * 1.4, 0, 0.8).rotate(Math.PI / 2).thresh(0.48)))
    .modulateScrollY(osc(rnd_btw(2, 5)).rotate(Math.PI / 2), () => 0.02 + a.fft[2] * 0.16)
    .pixelate(p, p)
    .posterize(2, 0.58)
    .add(src(o0).scrollX(() => 0.002 + a.fft[2] * 0.014).scale(1.003), 0.46)
    .add(noise(14, 0.3).thresh(0.94).pixelate(p, p), () => 0.18 + a.fft[3] * 0.42)
    .modulate(noise(0.6).pixelate(260, 4), () => 0.004 + a.fft[0] * 0.02)
    .color(rnd_btw(0.9, 1.5), rnd_btw(0.45, 1), rnd_btw(0.7, 1.4))
    .out();

  speed = 0.12;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "pixelated";
})();
