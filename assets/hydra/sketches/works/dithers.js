function rnd_btw(min, max) {
  return fxrand() * (max - min) + min;
}
function rnd_btwexp(min, max) {
  return fxrand() ** 2 * (max - min) + min;
}
function rnd_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fxrand() * (max - min + 1)) + min;
}
function rnd_poole() {
  mod = ["noise", "osc"];
  return mod[Math.floor(fxrand() * mod.length)];
}
function rnd_ojack() {
  oj = ["solid", "shape"];
  return oj[Math.floor(fxrand() * oj.length)];
}
function ramaRama() {
  cool = [
    0.01, 0.015, 0.02, 0.03, 0.04, 0.055, 0.1, 0.2, 0.24, 0.29, 0.42, 0.45,
    0.49, 0.58, 0.65, 0.74, 0.777, 0.888, 0.9, 0.91, 0.92, 0.95, 1.03, 1.06,
    1.18, 1.22, 1.3141592653589793, 1.36, 1.58, 1.65, 1.6969, 1.727, 1.789,
    1.816, 1.824, 1.844, 1.888, 1.94, 1.967, 19.68, 19.94, 199.5, 1999, 2.442,
    2.112, 2.32, 2.775,
  ];
  return cool[Math.floor(fxrand() * cool.length)];
}

//random function helpers
// fxrand() gives u a value between 0 and 1
// rnd_btw(a,b) gives u a value between a and b
// rnd_btwexp(a,b) gives u a value between a and b, but with an exponential slope (more probable to get the borders than the center)
// rnd_int(a,b) gives u an integer value between a and b

shp1 = rnd_int(3, 14);
shp2 = rnd_int(2, 16);
rHue = rnd_btwexp(0.01, 0.1);
rOsc = rnd_int(600, 900);
eid1 = rnd_int(1, 5);

rSld = rnd_btw(0.1, 0.8);
eid2 = rnd_int(2, 4);
eid3 = rnd_int(1, 3);
rX = rnd_int(1, 6);
rXs = rnd_btwexp(0.1, 1);
rY = rnd_int(2, 4);
rYs = rnd_btwexp(0.1, 1);
rpt = rnd_int(1, 2);
rama = ramaRama();
rScl = rnd_btw(0.69, 2.4);
pol = rnd_poole();
juice = rnd_ojack();
// frameRate(60);
// noLoop();

frund = () => noise(1.3, 0.05, 0).mult(gradient(3).r());
frund().colorama(0.05).out(o0);
src(o0)
  .modulateRotate(noise(5, 0.15), 0.01, 0.001)
  .hue(0.03)
  .diff(
    shape(shp1, 0.6, 1)
      .repeat(19, 19)
      .mult(osc(9, -0.02, 10))
      .rotate(({ time }) => time % 60)
      .scrollX(-1, 0.25)
      .scrollY(1, -0.25)
      .mult(
        shape(shp2, 0.22, 0.0001)
          .rotate(({ time }) => time % 60)
          .scrollY(1, -0.25),
      )
      .luma()
      // .color(0, 1, 1)
      .diff(voronoi(15, 0.01, 9000).kaleid(eid1)),
  )
  .out(o1);

noise(2, 0.4)
  .mask(shape(100, 10, 0.2))
  // .thresh(0.87, 0.5)
  .scale(0.1)
  // .thresh(0.5, 0.1)
  .add(
    noise(0.2, 0.1)
      .mask(shape(100, 3, 0.0))
      // .thresh(0.7, 0.2)
      .scale(0.1)
      .repeat(2, 2),
    // .thresh(0.8, 0.1)
  )
  .mask(noise(100, 0.1).scrollX(0, -0.043).contrast(5))
  .mask(
    gradient(0)
      .r()
      .modulateScrollY(osc(0.3), 10, 0.05)
      // .thresh(0.45, 0.02)
      .modulateScrollY(osc(0.3), 10, 0.05)
      .invert(),
  )
  .add(
    gradient(0)
      .r()
      .modulateScrollY(osc(0.3), 10, 0.05)
      // .thresh(0.5, 0.1)
      .modulateScrollY(osc(0.3), 10, 0.05)
      .modulatePixelate(noise(5, 0.5), 100),
    // .thresh(1, 0.1)
  )
  .mask(
    gradient(0)
      .r()
      .modulateScrollY(osc(0.3), 10, 0.05)
      // .thresh(0.5, 0.4)
      .modulateScrollY(osc(0.3), 10, 0.05),
  )
  .mask(
    gradient(0)
      .r()
      .modulateScrollY(osc(0.3), 10, 0.05)
      // .thresh(0.58, 0.005)
      .modulateScrollY(osc(0.3), 10, 0.05)
      .invert(-2.1),
  )
  .rotate(-1.4)
  .modulate(osc(5), 0.05, 0)
  .modulate(osc(13), 0.03, 0)
  .modulate(osc(13), 0.03, -0.5)
  .modulate(osc(300).modulateScale(noise(1), 1, 0), 0.1, 0)
  .modulateScale(osc(3, -0.2, 1))
  .scale(0.47)
  .out(o2);

src(o2)
  .diff(o1)
  .diff(solid(0.1))
  .modulateKaleid(
    voronoi(rpt, rHue, rSld).mult(src(o1).modulate(osc(46, 0.001, 0))),
  )
  .modulateScrollX(
    pol == "osc"
      ? noise(eid3, 0.1, 10)
      : osc(eid3, 0.1, 10).modulateHue(src(o2), 0.1, 10),
  )
  .modulateRotate(
    juice == "shape"
      ? gradient(rX).r().mult(src(o1))
      : shape(shp2, 0.55, 0.00001).modulatePixelate(
          gradient(rY).r().diff(src(o1)),
        ),
  )
  .modulate(
    pol == "noise" ? osc(eid1) : noise(eid2).modulateHue(src(o2), 0.1, 10),
  )
  .modulateScale(
    juice == "shape"
      ? voronoi(rSld)
      : shape(shp1, 0.321, 0.00001).r().modulateScale(src(o2)),
  )
  .colorama(rama)
  .luma(0.00001)
  .out(o3);

render(o3);
// hush();
