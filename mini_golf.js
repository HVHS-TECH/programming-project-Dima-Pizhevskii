/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
/// Written by ???
/*******************************************************/
	
/*******************************************************/


/*******************************************************/


let trackPoints = [];
    let res = 150; // High resolution so the polygon collision math is accurate
    let seed;
    
    // Sprites
    let ball;
    let hole;
    let obstacles = [];
    
    // Progression
    let level = 0;
    let won = false;

    function setup() {
      createCanvas(windowWidth, windowHeight);
      angleMode(DEGREES);
      
      // Check session storage for progressive difficulty across page reloads
      if (sessionStorage.getItem('golfLevel')) {
        level = parseInt(sessionStorage.getItem('golfLevel'));
      }
      
      initLevel();
    }

    function initLevel() {
      seed = random(1000);
      won = false;
      trackPoints = [];
      obstacles = [];
      
      generateTrackPoints();
      
      // Setup Sprites (0 degrees is right cap, 180 is left cap)
      let holePos = trackPoints[0];
      let ballPos = trackPoints[floor(res / 2)];
      
      // Move them safely inside the caps
      hole = new Hole(holePos.x - 50, holePos.y);
      ball = new Ball(ballPos.x + 50, ballPos.y);
      
      // Generate progressive obstacles safely inside the track
      let attempts = 0;
      while (obstacles.length < level && attempts < 500) {
        // Pick a random spot in the bounding box
        let rx = random(100, width - 100);
        let ry = random(50, height - 50);
        let testPoint = createVector(rx, ry);
        
        // Ensure it is on the grass AND not covering the ball/hole
        if (pointInPolygon(testPoint, trackPoints) &&
            testPoint.dist(ball.pos) > 80 && 
            testPoint.dist(hole.pos) > 80) {
          obstacles.push(new Obstacle(rx, ry));
        }
        attempts++;
      }
    }

    function draw() {
      background(34, 100, 34); 
      
      // --- Draw Track ---
      fill(85, 180, 85);
      stroke(150, 220, 150);
      strokeWeight(8);
      
      beginShape();
      for (let p of trackPoints) curveVertex(p.x, p.y);
      for (let i = 0; i < 3; i++) curveVertex(trackPoints[i].x, trackPoints[i].y);
      endShape();
      
      // --- Update & Draw Sprites ---
      hole.display();
      
      for (let obs of obstacles) {
        obs.display();
        obs.collide(ball); // Bounce ball off obstacles
      }

      if (!won) {
        ball.update(trackPoints);
        ball.display();
        
        // Check win condition
        if (ball.pos.dist(hole.pos) < hole.r) {
          won = true;
          ball.active = false; // Disappear
        }
      } else {
        // Win Text
        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(32);
        text("HOLE IN ONE!", width / 2, height / 2 - 20);
        textSize(16);
        text(`Level ${level} Cleared. Click to advance to Level ${level + 1}`, width / 2, height / 2 + 20);
      }
      
      // UI
      textAlign(LEFT, TOP);
      fill(255);
      noStroke();
      textSize(16);
      text(`Level: ${level}`, 20, 20);
    }

    // Move to next level on click
    function mousePressed() {
      level++;
      sessionStorage.setItem('golfLevel', level);
      initLevel();
    }

    // ==========================================
    // SPRITE CLASSES
    // ==========================================

    class Ball {
      constructor(x, y) {
        this.pos = createVector(x, y);
        // Random starting direction, speed of 4
        this.vel = p5.Vector.random2D().mult(4); 
        this.r = 14; // Larger ball
        this.active = true;
      }

      update(polygon) {
        if (!this.active) return;
        this.pos.add(this.vel);
        this.checkTrackEdges(polygon);
      }

      display() {
        if (!this.active) return;
        fill(255);
        stroke(200);
        strokeWeight(1);
        circle(this.pos.x, this.pos.y, this.r * 2);
        fill(0, 50); noStroke();
        ellipse(this.pos.x + 2, this.pos.y + 4, this.r * 2, this.r); // Shadow
      }

      checkTrackEdges(polygon) {
        let minDist = Infinity;
        let closestNormal = null;
        let closestPoint = null;

        // Find the closest point on the polygon perimeter
        for (let i = 0; i < polygon.length; i++) {
          let a = createVector(polygon[i].x, polygon[i].y);
          let b = createVector(polygon[(i+1) % polygon.length].x, polygon[(i+1) % polygon.length].y);
          
          let ab = p5.Vector.sub(b, a);
          let ap = p5.Vector.sub(this.pos, a);
          let t = constrain(ap.dot(ab) / ab.magSq(), 0, 1);
          let cp = p5.Vector.add(a, p5.Vector.mult(ab, t));
          
          let d = p5.Vector.dist(this.pos, cp);
          if (d < minDist) {
            minDist = d;
            closestPoint = cp;
            // Normal pointing from the edge to the ball
            closestNormal = p5.Vector.sub(this.pos, cp).normalize();
          }
        }

        // Bounce if touching the edge
        if (minDist <= this.r + 4) { // +4 accounts for the thick track stroke
          // Push out to prevent getting stuck
          this.pos = p5.Vector.add(closestPoint, p5.Vector.mult(closestNormal, this.r + 4));
          // Reflect velocity against the normal
          this.vel.reflect(closestNormal);
        } else if (!pointInPolygon(this.pos, polygon)) {
          // Failsafe: if it escapes the polygon entirely, invert velocity
          this.vel.mult(-1);
          this.pos.add(this.vel.copy().mult(2));
        }
      }
    }

    class Hole {
      constructor(x, y) {
        this.pos = createVector(x, y);
        this.r = 22; // Larger hole
      }
      display() {
        fill(20); noStroke();
        circle(this.pos.x, this.pos.y, this.r * 2);
        
        // Flag
        stroke(255); strokeWeight(3);
        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y - 50);
        fill(220, 50, 50); noStroke();
        triangle(this.pos.x, this.pos.y - 50, this.pos.x + 28, this.pos.y - 40, this.pos.x, this.pos.y - 30);
      }
    }

    class Obstacle {
      constructor(x, y) {
        this.pos = createVector(x, y);
        this.r = random(15, 25);
      }
      display() {
        fill(150, 100, 50); // Wooden/Dirt color
        stroke(100, 500, 400);
        strokeWeight(3);
        circle(this.pos.x, this.pos.y, this.r * 2);
      }
      collide(ball) {
        if (!ball.active) return;
        let d = this.pos.dist(ball.pos);
        if (d < this.r + ball.r) {
          // Standard circle-circle bounce collision
          let normal = p5.Vector.sub(ball.pos, this.pos).normalize();
          // Push ball out of the obstacle
          ball.pos = p5.Vector.add(this.pos, p5.Vector.mult(normal, this.r + ball.r));
          // Reflect ball velocity
          ball.vel.reflect(normal);
        }
      }
    }

    // ==========================================
    // UTILITIES
    // ==========================================

    function generateTrackPoints() {
      let trackLength = random(950, 920); 
      let trackWidth = random(100, 500);
      let bendAmount = random(-120, 150);
      let noiseAmount = 100;
      
      // Calculate coordinates using actual screen space (width/2) instead of translate()
      // This makes the collision math much easier for the sprites.
      let cx = width / 2;
      let cy = height / 2;

      for (let i = 0; i < res; i++) {
        let angle = map(i, 0, res, 0, 360);
        
        let x = trackLength * cos(angle);
        let y = trackWidth * sin(angle);
        
        let nx = cos(angle) * 0.5; 
        let ny = sin(angle) * 0.5;
        let displacement = map(noise(seed + nx, seed + ny), 0, 1, -noiseAmount, noiseAmount);
        
        x += displacement * cos(angle);
        y += displacement * sin(angle);
        
        let warpAngle = map(x, -trackLength, trackLength, 0, 360);
        y += sin(warpAngle) * bendAmount;
        
        // Push the final global screen coordinates
        trackPoints.push({x: cx + x, y: cy + y});
      }
    }

    // Ray-Casting algorithm to check if a point is inside a polygon boundary
    function pointInPolygon(p, poly) {
      let isInside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i].x, yi = poly[i].y;
        let xj = poly[j].x, yj = poly[j].y;
        let intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
      }
      return isInside;
    }
/*******************************************************/
//  END OF APP
/*******************************************************/	