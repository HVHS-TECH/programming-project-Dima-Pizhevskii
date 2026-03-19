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

let ballX, ballY;
let ballVelX = 0;
let ballVelY = 0;
let ballR = 14;

let holeX, holeY;
let holeR = 22;

let dragging = false;
let pickupX = 0;
let pickupY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function initLevel() {
  seed = random(1000);
  trackPoints = [];
  ballVelX = 0;
  ballVelY = 0;

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

  holeX = trackPoints[0].x * 0.8 + cx * 0.2;
  holeY = trackPoints[0].y * 0.8 + cy * 0.2;

  let halfTrack = floor(res / 2);
  ballX = trackPoints[halfTrack].x * 0.8 + cx * 0.2;
  ballY = trackPoints[halfTrack].y * 0.8 + cy * 0.2;
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

  fill(20);
  noStroke();
  circle(holeX, holeY, holeR * 2);

  stroke(255);
  strokeWeight(3);
  line(holeX, holeY, holeX, holeY - 50);
  fill(220, 50, 50);
  noStroke();
  triangle(holeX, holeY - 50, holeX + 28, holeY - 40, holeX, holeY - 30);

  // physics - friction
  ballVelX *= 0.97;
  ballVelY *= 0.97;

  // snap to zero if moving extremely slowly
  if (abs(ballVelX) < 0.05) ballVelX = 0;
  if (abs(ballVelY) < 0.05) ballVelY = 0;

  ballX += ballVelX;
  ballY += ballVelY;

  fill(255);
  stroke(200);
  strokeWeight(1);
  circle(ballX, ballY, ballR * 2);

  if (dragging) {
    stroke(255, 255, 0);
    strokeWeight(3);
    line(ballX, ballY, mouseX, mouseY);
  }
}

function mousePressed() {
  if (gameState === "menu") {
    gameState = "play";
    initLevel();
  } else if (gameState === "play") {
    let isMoving = (abs(ballVelX) > 0 || abs(ballVelY) > 0);
    let d = dist(mouseX, mouseY, ballX, ballY);

    if (d < ballR * 3 && !isMoving) {
      dragging = true;
      pickupX = mouseX;
      pickupY = mouseY;
    }
  }
}

function mouseReleased() {
  if (gameState === "play" && dragging) {
    dragging = false;
    let pushX = pickupX - mouseX;
    let pushY = pickupY - mouseY;

    ballVelX = pushX * 0.1;
    ballVelY = pushY * 0.1;
  }
}
/*******************************************************/
//  END OF APP
/*******************************************************/	