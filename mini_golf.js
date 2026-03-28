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

let level = 1;
let won = false;
let strokes = 0;
let totalScore = 0;
let winMsg = "";
let numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function initLevel() {
  seed = random(1000);
  won = false;
  strokes = 0;
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
  } else if (gameState === "gameover") {
    drawGameOver();
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

function drawGameOver() {
  background(34, 100, 34);
  textAlign(CENTER, CENTER);
  fill(255);
  noStroke();
  textSize(48);
  text("COURSE COMPLETE", width / 2, height / 2 - 40);
  textSize(24);
  text("Total Score: " + totalScore + " strokes", width / 2, height / 2 + 10);
  textSize(16);
  text("Click to play again", width / 2, height / 2 + 60);
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

  if (!won) {
    ballVelX *= 0.97;
    ballVelY *= 0.97;

    if (abs(ballVelX) < 0.05) ballVelX = 0;
    if (abs(ballVelY) < 0.05) ballVelY = 0;

    ballX += ballVelX;
    ballY += ballVelY;

    checkEdges();

    fill(255);
    stroke(200);
    strokeWeight(1);
    circle(ballX, ballY, ballR * 2);

    if (dist(ballX, ballY, holeX, holeY) < holeR) {
      won = true;
      totalScore += strokes;

      if (strokes <= 10 && strokes > 0) {
        winMsg = "Hole in " + numberWords[strokes] + "!";
      } else {
        winMsg = "Hole in " + strokes + "!";
      }
    }

    if (dragging) {
      stroke(255, 255, 0);
      strokeWeight(3);
      line(ballX, ballY, mouseX, mouseY);
    }

  } else {
    textAlign(CENTER, CENTER);
    fill(255);
    noStroke();
    textSize(32);
    text(winMsg, width / 2, height / 2 - 20);
    textSize(16);
    text("Click to play level " + (level + 1), width / 2, height / 2 + 20);
  }

  textAlign(LEFT, TOP);
  fill(255);
  noStroke();
  textSize(16);
  text("Level: " + level + " / 20", 20, 20);
  text("Strokes: " + strokes, 20, 45);
  text("Total Score: " + totalScore, 20, 70);
}

function mousePressed() {
  if (gameState === "menu") {
    gameState = "play";
    level = 1;
    totalScore = 0;
    initLevel();
  } else if (gameState === "play") {
    if (won) {
      level++;
      if (level >= 20) {
        gameState = "gameover";
      } else {
        initLevel();
      }
    } else {
      let isMoving = (abs(ballVelX) > 0 || abs(ballVelY) > 0);
      let d = dist(mouseX, mouseY, ballX, ballY);

      if (d < ballR * 3 && !isMoving) {
        dragging = true;
        pickupX = mouseX;
        pickupY = mouseY;
      }
    }
  } else if (gameState === "gameover") {
    gameState = "menu";
  }
}

function mouseReleased() {
  if (gameState === "play" && dragging) {
    dragging = false;
    let pushX = pickupX - mouseX;
    let pushY = pickupY - mouseY;

    if (abs(pushX) > 5 || abs(pushY) > 5) {
      ballVelX = pushX * 0.1;
      ballVelY = pushY * 0.1;
      strokes++;
    }
  }
}

function checkEdges() {
  let minDist = 9999;
  let normalX = 0;
  let normalY = 0;
  let cpX = 0;
  let cpY = 0;

  for (let i = 0; i < trackPoints.length; i++) {
    let p1 = trackPoints[i];
    let p2 = trackPoints[(i + 1) % trackPoints.length];

    let abX = p2.x - p1.x;
    let abY = p2.y - p1.y;
    let apX = ballX - p1.x;
    let apY = ballY - p1.y;

    let abMagSq = abX * abX + abY * abY;
    let dot = apX * abX + apY * abY;
    let t = Math.max(0, Math.min(1, dot / abMagSq));

    let closestX = p1.x + t * abX;
    let closestY = p1.y + t * abY;

    let dX = ballX - closestX;
    let dY = ballY - closestY;
    let d = Math.sqrt(dX * dX + dY * dY);

    if (d < minDist) {
      minDist = d;
      cpX = closestX;
      cpY = closestY;
      normalX = dX / d;
      normalY = dY / d;
    }
  }

  if (minDist <= ballR + 4) {
    ballX = cpX + normalX * (ballR + 4);

    let dotVel = ballVelX * normalX + ballVelY * normalY;
    ballVelX = ballVelX - 2 * dotVel * normalX;
    ballVelY = ballVelY - 2 * dotVel * normalY;

    ballVelX *= 0.8;
    ballVelY *= 0.8;
  }
}
/*******************************************************/
//  END OF APP
/*******************************************************/	