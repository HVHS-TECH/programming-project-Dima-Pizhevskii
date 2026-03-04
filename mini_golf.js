/*******************************************************/
// Programming project
/// Written by Dima Pizhevskii
/*******************************************************/

/*******************************************************/


/*******************************************************/
let gameState = "menu";

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  if (gameState === "menu") {
    drawMenu();
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

function mousePressed() {
  if (gameState === "menu") {
    gameState = "play";
  }
}
/*******************************************************/
//  END OF APP
/*******************************************************/	