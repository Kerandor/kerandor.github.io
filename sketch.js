p5.disableFriendlyErrors = true;
var t = 0;
var button1;
var button2;
var button3;
var canva;
var r;
var sh = 0;
var fr = 255
var g;


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
  translate(50, 4);
  strokeWeight(0.21);
  t += 0.001;
  drawingContext.filter = "saturate(85) drop-shadow(8 6 4Q#0400)";
  drawingContext.setLineDash([2, 70, 22.5, 5, ]);
  for (i = 9; i; i--) {
    beginShape();
    for (r = 1 + sh; r < 2 + 2 * TAU; r += 0.05)
      curveVertex(
        cos(r - 8)*
          (D =
            (noise(-sin(r * 4), i ^ (sh * 99), t * 1.2) / i) *
            145 *
            (cos(r / 8) ** 12 * 1 + 2.5)) +
          460,
        sin(r - 8) * -D + 360
      );
    let arr = 355 * noise(t * 6);
    let g = 355 * noise(t * 5);
    let b = 555 * noise(t * 18);
    let z = 10 * noise(t + 400);
    fill(arr, g, b, z);
    t = t + 0.000000000001;
    endShape(CLOSE);
    translate(0, 0)
  }
}

function rugged() {
  noLoop();
  background(255);
  push();
  shearY(720);
  shearX(-320);
  translate(150, -80);
  
}

function vibe() {
  loop();
  push();
  r = sh - (frameCount * 2);
}

function gn() {
  rotate(720);
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
