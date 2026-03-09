/*******************************************************/
// Programming project
/// Written by Dima Pizhevskii
/*******************************************************/

/*******************************************************/


/*******************************************************/
let gameState = "menu";
let trackPoints = [];
let res = 100;
let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function initLevel() {
  seed = random(1000);
  trackPoints = [];
  let cx = width / 2;
  let cy = height / 2;
  let noiseMax = 1;

  for (let a = 0; a < 360; a += 360 / res) {
    let xoff = map(cos(a), -1, 1, 0, noiseMax);
    let yoff = map(sin(a), -1, 1, 0, noiseMax);
    let r = map(noise(seed + xoff, seed + yoff), 1.1, 0.78, 10, 100);
    let x = cx + r * cos(a);
    let y = cy + r * sin(a);
    trackPoints.push(createVector(x, y));
  }
}

function draw() {
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "play") {
    drawGame();
  }
}

function drawMenu() {
  background(34, 100, 34);
  textAlign(CENTER, CENTER);
  fill(255);
  noStroke();
  textSize(48);
  text("MINI GOLF", width / 2, height / 2 - 40);
  textSize(24);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawGame() {
  background(34, 100, 34);
  // draw track
  fill(85, 180, 85);
  stroke(150, 220, 150);
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < trackPoints.length; i++) {
    curveVertex(trackPoints[i].x, trackPoints[i].y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(trackPoints[i].x, trackPoints[i].y);
  }
  endShape();
}

function mousePressed() {
  if (gameState === "menu") {
    gameState = "play";
    initLevel();
  }
}
/*******************************************************/
//  END OF APP
/*******************************************************/	