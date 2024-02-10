let dataPoints = [];
let currentDataPointIndex = 0;
let oldDataPointIndex = 0;
let frameRateValue = 25;
let continueAnimation = true;
let canvasWidth = 1920;
let canvasHeight = 1080;
let directionIndicatorColor;
let directionChangeCounter = 0;
let previousDirection = "left";
let previousVelocity = 0;
let xOffset = -700; // Adjust this value to move the entire visualization to the right
let exportInterval = 15 * frameRateValue; // Export every 15 seconds
let textY = 70; // Starting Y coordinate for the text elements

let lowestY, highestY;
let directionChangeTimestamps = [];
let maxDirectionDuration = 0;
let minDirectionDuration = Infinity;
let playPauseBtn; // Button for toggling animation

function calculatePercentagePosition(y) {
  return map(y, lowestY, highestY, 0, 100);
}

function calculateFrequency(y) {
  return map(y, lowestY, highestY, 196.0, 659.3).toFixed(1);
}

function updateStringText() {
  let percentage = calculatePercentagePosition(dataPoints[currentDataPointIndex].yPos);
  if (percentage >= 0 && percentage < 25) {
    text("string: 1", 10, 225);
  } else if (percentage >= 25 && percentage < 50) {
    text("string: 2", 10, 225);
  } else if (percentage >= 50 && percentage < 75) {
    text("string: 3", 10, 225);
  } else if (percentage >= 75 && percentage <= 100) {
    text("string: 4", 10, 225);
  }
}

function updateLegatoStaccatoText() {
  if (directionChangeTimestamps.length >= 2) {
    let currentTimestamp = millis();
    let currentDirectionDuration = currentTimestamp - directionChangeTimestamps[directionChangeTimestamps.length - 2];
    maxDirectionDuration = max(maxDirectionDuration, currentDirectionDuration);
    minDirectionDuration = min(minDirectionDuration, currentDirectionDuration);
    let percentageDuration = map(currentDirectionDuration, minDirectionDuration, maxDirectionDuration, 0, 100);
    if (percentageDuration >= 0 && percentageDuration < 20) {
      text("legato/staccato: staccato", 10, 115);
    } else if (percentageDuration >= 20 && percentageDuration < 40) {
      text("legato/staccato: legato", 10, 115);
    } else if (percentageDuration >= 40 && percentageDuration < 60) {
      text("legato/staccato: legato lungo", 10, 115);
    } else if (percentageDuration >= 60 && percentageDuration <= 100) {
      text("legato/staccato: legato lunghissimo", 10, 115);
    }
  }
}

function preload() {
  loadTable("MATTEO1-LESS.csv", "csv", "header", function(table) {
    dataPoints = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
    lowestY = min(dataPoints.map(point => point.yPos));
    highestY = max(dataPoints.map(point => point.yPos));
  });
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(frameRateValue);
  directionIndicatorColor = color(0, 255, 0);
  playPauseBtn = createButton('Pause');
  playPauseBtn.position(50, canvasHeight -100);
  playPauseBtn.mousePressed(toggleAnimation);
}

function draw() {
  if (!continueAnimation) return; // Stop the draw function if animation is paused
  
  background(255);
  for (let i = oldDataPointIndex; i < currentDataPointIndex; i++) {
    const sec = 213 / 25;
    dataPoints[i].xPos -= sec * 0.35;
  }

  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 1; i <= currentDataPointIndex; i++) {
    vertex(dataPoints[i].xPos - xOffset, dataPoints[i].yPos);
  }
  endShape();

  for (let i = 1; i <= currentDataPointIndex; i++) {
    let brightness = map(i, 0, currentDataPointIndex, 100, 255);
    stroke(0, brightness);
    fill(0, brightness);
    if (i === currentDataPointIndex) {
      let dx = dataPoints[i].xPos - dataPoints[i - 1].xPos;
      let dy = dataPoints[i].yPos - dataPoints[i - 1].yPos;
      let velocity = sqrt(dx * dx + dy * dy);
      let dotSize = map(velocity, 0, 10, 2, 10);
      ellipse(dataPoints[i].xPos - xOffset, dataPoints[i].yPos, dotSize, dotSize);
      previousVelocity = velocity;
    } else {
      ellipse(dataPoints[i].xPos - xOffset, dataPoints[i].yPos, 5, 5);
    }
  }

  fill(0);
  textSize(20);
  text("Row: " + currentDataPointIndex, 10, 25);
  if (currentDataPointIndex > 0) {
    let dx = dataPoints[currentDataPointIndex].xPos - dataPoints[currentDataPointIndex - 1].xPos;
    let dy = dataPoints[currentDataPointIndex].yPos - dataPoints[currentDataPointIndex - 1].yPos;
    let distance = sqrt(dx * dx + dy * dy);
    text("Distance: " + distance.toFixed(2), 10, 47);
    text("X: " + dataPoints[currentDataPointIndex].xPos.toFixed(2), 10, 70);
    text("Y: " + dataPoints[currentDataPointIndex].yPos.toFixed(2), 10, 90);
    let currentDirection = (dx > 0) ? "right" : "left";
    if (previousDirection !== currentDirection) {
      directionChangeCounter++;
      previousDirection = currentDirection;
      directionChangeTimestamps.push(millis());
      if (directionChangeTimestamps.length > 2) {
        directionChangeTimestamps.shift();
      }
    }
    directionIndicatorColor = (dx > 0) ? color(255, 0, 0) : color(0, 255, 0);
  }

  text("Direction Changes: " + directionChangeCounter, 10, 170);
  text("Velocity: " + previousVelocity.toFixed(2), 10, 200);
  updateStringText();
  updateLegatoStaccatoText();
  let frequencyText = "Frequency: " + calculateFrequency(dataPoints[currentDataPointIndex].yPos) + " Hz";
  text(frequencyText, 10, 140);
  currentDataPointIndex++;
  if (currentDataPointIndex >= dataPoints.length && !isNewInputAvailable()) {
    saveCanvas('drawing', 'png');
    continueAnimation = false;
  }
  if (dataPoints[currentDataPointIndex - 1].xPos - xOffset > canvasWidth) {
    canvasWidth += 100;
    resizeCanvas(canvasWidth, canvasHeight);
  }
  fill(directionIndicatorColor);
  ellipse(20, 250, 25, 25);
}

function toggleAnimation() {
  continueAnimation = !continueAnimation;
  if (continueAnimation) {
    playPauseBtn.html('Pause');
    loop();
  } else {
    playPauseBtn.html('Play');
    noLoop();
  }
}

function isNewInputAvailable() {
  return false; // Placeholder for actual input check
}
