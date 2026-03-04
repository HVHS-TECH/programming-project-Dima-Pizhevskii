/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
/// Written by ???
/*******************************************************/
	
/*******************************************************/


/*******************************************************/
let trackPoints = [];
let res = 200; // High resolution for maximum smoothness
let seed;

function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);
  noLoop();
  seed = random(1000);
}

function draw() {
  background(34, 100, 34); // Deep grass green
  
  // Center the track on the screen
  translate(width / 2, height / 2);
  
  generateTrackPoints();
  
  // 1. Draw the putting green (The Main Blob)
  fill(85, 180, 85);
  stroke(150, 220, 150);
  strokeWeight(8);
  
  beginShape();
  // We use curveVertex exactly as the article suggests
  for (let i = 0; i < trackPoints.length; i++) {
    curveVertex(trackPoints[i].x, trackPoints[i].y);
  }
  
  // THE ARTICLE'S TRICK: Repeat the first 3 points to ensure the 
  // start and end of the loop connect perfectly without a gap.
  for (let i = 0; i < 3; i++) {
    curveVertex(trackPoints[i].x, trackPoints[i].y);
  }
  endShape(CLOSE);
  
  drawProps();
}

function generateTrackPoints() {
  trackPoints = [];
  
  // Random track parameters for a unique layout every reload
  let trackLength = random(300, 350); 
  let trackWidth = random(40, 60);
  let curvature = random(-140, 140); // How much the "S" bend is
  let noiseScale = random(0.5, 2); // How "blobby" the edges are
  
  for (let i = 0; i < res; i++) {
    let angle = map(i, 0, res, 0, 360);
    
    // 1. Basic Trigonometric Ellipse (Stretched)
    let x = trackLength * cos(angle);
    let y = trackWidth * sin(angle);
    
    // 2. Add the "Blobby" displacement from the article
    // Using noise instead of random for smoother ripples
    let nx = cos(angle) + 1; 
    let ny = sin(angle) + 1;
    let displacement = noise(seed + nx * noiseScale, seed + ny * noiseScale) * 25;
    
    // Apply displacement radially
    x += displacement * cos(angle);
    y += displacement * sin(angle);
    
    // 3. THE CURVATURE WARP (This makes it a path)
    // We bend the Y coordinate based on where we are along the X axis
    // This creates a smooth "S" or "C" curve without breaking the caps
    let bend = sin(map(x, -trackLength, trackLength, 0, 180)) * curvature;
    y += bend;
    
    trackPoints.push({x: x, y: y});
  }
}

function drawProps() {
  // Find the ends of the track for the hole and ball
  // Points at 0 degrees and 180 degrees are the tips of the "caps"
  let startIdx = 0;
  let endIdx = floor(res / 2);
  
  let start = trackPoints[startIdx];
  let end = trackPoints[endIdx];

  // Hole
  push();
  translate(start.x * 0.85, start.y); // Place slightly inside the cap
  fill(20);
  noStroke();
  circle(0, 0, 25);
  
  // Flag
  stroke(255);
  strokeWeight(3);
  line(0, 0, 0, -50);
  fill(220, 50, 50);
  noStroke();
  triangle(0, -50, 25, -40, 0, -30);
  pop();

  // Ball
  push();
  translate(end.x * 0.85, end.y);
  fill(255);
  stroke(200);
  strokeWeight(1);
  circle(0, 0, 12);
  

}

// Reload the page to see a new unique track
function mousePressed() {
  location.reload();
}
/*******************************************************/
//  END OF APP
/*******************************************************/	