p5.disableFriendlyErrors = true;
var t = 0;
let button1;
let button2;
let button3;
let canva;
let r;
let sh;

function setup() {
	blendMode(SCREEN);
  noLoop();
  pixelDensity();
  createCanvas(windowWidth, widowHeight);
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
	frameRate(99);
}

function draw() {
	loop();
  strokeWeight(0.251);
  t += 0.00005;
  drawingContext.filter = "saturate(45) drop-shadow(8 6 4Q#0400)";
  drawingContext.setLineDash([1, 3, 50, 3, 2]);
  for (i = 7; i; i--) {
    beginShape();
    let sh = 1.5;
    for (r = 1+(2*sh); r < 2 + TAU; r += 0.03)
      curveVertex(
        sin(r * 7) *
          (D =
            (noise(-sin(r * 14), i * 99, t) / i) *
            145 *
            (cos(r / 8) ** 12 * 8 + 2.5)) +
          460,
        -cos(r * 2) * -D + 360
      );
    let arr = 355 * noise(t * 2.2);
    let g = 355 * noise(t * 3.4);
    let b = 255 * noise(t * 1.6);
    let z = 55 * noise(t + 420);
    fill(arr, g, b, z);
    t = t + 0.001;
    endShape(CLOSE);
  }
}

function rugged() {
  sh = sh + 1.5;
  noLoop();
  background(255);
}

function vibe() {
  loop();
}

function gn() {
  noLoop();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
 // background(255);
}
