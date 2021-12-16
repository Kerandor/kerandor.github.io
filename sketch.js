p5.disableFriendlyErrors = true;
var t = 0;
let button1;
let button2;
let button3;
let canva;
let r;
let sh = 0;
var fr = 155
let g;
let D;

function setup() {
  blendMode(SCREEN);
  noLoop();
  pixelDensity();
  createCanvas(windowWidth, windowHeight);
  background(255);
  button1 = createButton("!vibe");
  button1.position(280, 735);
  button1.mousePressed(vibe);
  button2 = createButton("gn");
  button2.position(690, 735);
  button2.mousePressed(gn);
  button3 = createButton("pull rug");
  button3.position(480, 775);
  button3.mousePressed(rugged);
  frameRate(fr);
}

function draw() {
  strokeWeight(0.251);
  t += 0.0009;
  drawingContext.filter = "saturate(65) drop-shadow(8 6 4Q#0400)";
  drawingContext.setLineDash([2, 50, 12.5, 5]);
  for (i = 2; i; i--) {
    beginShape();
    for (r = 1 + sh; r < 2 + 2 * TAU; r += 0.05)
      curveVertex(
        sin(r + 1)*
          (D =
            (noise(-sin(r * 4), i ^ (sh * 99), t) / i) *
            145 *
            (cos(r / 8) ** 12 * 1 + 2.5)) +
          460,
        cos(r / 3) * -D + 360
      );
    let arr = 355 * noise(t * 16);
    let g = 355 * noise(t * 5);
    let b = 255 * noise(t * 3);
    let z = 75 * noise(t + 420);
    fill(arr, g, b, z);
    t = t + 0.000000001;
    endShape(CLOSE);
  }
}

function rugged() {
  noLoop();
  background(255);
  D = sin(D*18);
}

function vibe() {
  loop();
  r = sh - (frameCount * 2);
}

function gn() {
  t *= 1.5;
  sh += -0.2;
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255);
  rate();
}

function rate() {
  frameRate();
}
