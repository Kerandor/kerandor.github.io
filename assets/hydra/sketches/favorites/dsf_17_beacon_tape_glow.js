// dsf_17_beacon_tape_glow - warm lantern pulses with tape ghosting
(async () => {
  o0.constructor.prototype.setMode = function (mode = "nearest") {
    mode = mode == "linear" ? "linear" : "nearest";
    this.fbos = Array(2).fill().map(() => this.regl.framebuffer({ color: this.regl.texture({ mag: mode, min: mode, width: width, height: height, format: "rgba" }), depthStencil: false }));
  };
  function rnd_btw(a, b) { return fxrand() * (b - a) + a; }
  function rnd_int(a, b) { return Math.floor(fxrand() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a); }
  o0.setMode("linear");
  fps = 30;

  let pulse = rnd_btw(0.2, 0.55);
  let carrier = rnd_btw(18, 42);
  let p = rnd_int(70, 150);

  osc(pulse, 0.01, 0.22).thresh(() => 0.78 - a.fft[0] * 0.42).scrollX(-0.22)
    .add(osc(pulse * 1.14, 0.01, 0.22).thresh(() => 0.78 - a.fft[1] * 0.4).scrollX(0.22), 0.95)
    .mult(osc(carrier, 0.014, 1).rotate(Math.PI / 2).modulate(noise(1.1, 0.12).pixelate(400, 8), () => 0.015 + a.fft[1] * 0.05))
    .pixelate(p, rnd_int(12, 30))
    .add(src(o0).scale(1.006).luma(0.05).colorama(0.016), 0.62)
    .add(src(o0).scrollY(() => 0.002 + a.fft[0] * 0.008).color(1.3, 0.55, 0.35), 0.22)
    .modulate(noise(0.55).pixelate(2, 180), () => 0.003 + a.fft[2] * 0.018)
    .color(rnd_btw(1.05, 1.65), rnd_btw(0.48, 1.05), rnd_btw(0.22, 0.72))
    .hue(() => Math.sin(time * 0.045) * 0.08 + a.fft[2] * 0.16)
    .out();

  speed = 0.18;
  document.getElementsByTagName("canvas")[0].style["imageRendering"] = "auto";
})();
