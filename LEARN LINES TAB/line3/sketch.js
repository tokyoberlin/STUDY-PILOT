//ANALYZE A LINE WITH STATS BUT NO BPM

// ORIGINAL SKETCH FILE TO ANALYZE A LINE

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
let xOffset = -600; // Adjust this value to move the entire visualization to the right
let exportInterval = 15 * frameRateValue; // Export every 15 seconds
let textY = 70; // Starting Y coordinate for the text elements


let lowestY, highestY;

let directionChangeTimestamps = [];
let maxDirectionDuration = 0;
let minDirectionDuration = Infinity;

function calculatePercentagePosition(y) {
  return map(y, lowestY, highestY, 0, 100);
}

function calculateFrequency(y) {
  // Map the y position to the frequency range
  return map(y, lowestY, highestY, 196.0, 659.3).toFixed(1);
}

function updateStringText() {
  let percentage = calculatePercentagePosition(dataPoints[currentDataPointIndex].yPos);
  if (percentage >= 0 && percentage < 25) {
    text("string: 1", 10, 225); // Adjust the Y-coordinate to 130 to move it 30 pixels down
  } else if (percentage >= 25 && percentage < 50) {
    text("string: 2", 10, 225); // Adjust the Y-coordinate to 130 to move it 30 pixels down
  } else if (percentage >= 50 && percentage < 75) {
    text("string: 3", 10, 225); // Adjust the Y-coordinate to 130 to move it 30 pixels down
  } else if (percentage >= 75 && percentage <= 100) {
    text("string: 4", 10, 225); // Adjust the Y-coordinate to 130 to move it 30 pixels down
  }
}


function updateLegatoStaccatoText() {
  if (directionChangeTimestamps.length >= 2) {
    // Calculate the duration of the current direction
    let currentTimestamp = millis();
    let currentDirectionDuration = currentTimestamp - directionChangeTimestamps[directionChangeTimestamps.length - 2];

    // Update the longest and shortest durations
    maxDirectionDuration = max(maxDirectionDuration, currentDirectionDuration);
    minDirectionDuration = min(minDirectionDuration, currentDirectionDuration);

    // Calculate the percentage duration
    let percentageDuration = map(currentDirectionDuration, minDirectionDuration, maxDirectionDuration, 0, 100);

    // Update the "legato/staccato" text based on the percentage duration
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
  loadTable("vla.csv", "csv", "header", function(table) {
    dataPoints = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));

    // Find the lowest and highest y positions in the data
    lowestY = min(dataPoints.map(point => point.yPos));
    highestY = max(dataPoints.map(point => point.yPos));
  });
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(frameRateValue);
  directionIndicatorColor = color(0, 255, 0); // Initial color (green)
}

function draw() {
  background(255);

  // Move only old points to the left faster
  for (let i = oldDataPointIndex; i < currentDataPointIndex; i++) {
    const sec = 213 / 25;
    dataPoints[i].xPos -= sec * 0.25;
    //-5

    // Adjust the speed as needed
  }

  stroke(0);
  strokeWeight(2);
  noFill();

  // Draw the line
  beginShape();
  for (let i = 1; i <= currentDataPointIndex; i++) {
    vertex(dataPoints[i].xPos - xOffset, dataPoints[i].yPos);
  }
  endShape();

  // Draw dots for each new row
  for (let i = 1; i <= currentDataPointIndex; i++) {
    // Adjust brightness based on the age of the dot
    let brightness = map(i, 0, currentDataPointIndex, 100, 255);
    stroke(0, brightness);
    fill(0, brightness);

    // Make the dot bigger for the latest data point based on velocity
    if (i === currentDataPointIndex) {
      let dx = dataPoints[i].xPos - dataPoints[i - 1].xPos;
      let dy = dataPoints[i].yPos - dataPoints[i - 1].yPos;
      let velocity = sqrt(dx * dx + dy * dy);
      let dotSize = map(velocity, 0, 10, 2, 10); // Adjust the velocity range and dot size as needed
      ellipse(dataPoints[i].xPos - xOffset, dataPoints[i].yPos, dotSize, dotSize);
      previousVelocity = velocity;
    } else {
      // Regular dot size for other data points
      ellipse(dataPoints[i].xPos - xOffset, dataPoints[i].yPos, 5, 5);
    }
  }

  // Display the counters and direction indicator in the top-left corner
  fill(0);
  textSize(13);
  text("Row: " + currentDataPointIndex, 10, 25);

  if (currentDataPointIndex > 0) {
    // Calculate distance between consecutive points
    let dx = dataPoints[currentDataPointIndex].xPos - dataPoints[currentDataPointIndex - 1].xPos;
    let dy = dataPoints[currentDataPointIndex].yPos - dataPoints[currentDataPointIndex - 1].yPos;
    let distance = sqrt(dx * dx + dy * dy);

    text("Distance: " + distance.toFixed(2), 10, 47);
    text("X: " + dataPoints[currentDataPointIndex].xPos.toFixed(2), 10, 70);
    text("Y: " + dataPoints[currentDataPointIndex].yPos.toFixed(2), 10, 90);

    // Determine the direction and set the indicator color
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



  // Display the direction change counter
  fill(0);
  text("Direction Changes: " + directionChangeCounter, 10, 170);

  // Display the velocity in real-time
  text("Velocity: " + previousVelocity.toFixed(2), 10, 200);

  // Update the "string" text based on the current percentage position
  updateStringText();

  // Update the "legato/staccato" text based on the duration of movement in one direction
  updateLegatoStaccatoText();
  
  // Update the "Frequency" text based on the current y position
  let frequencyText = "Frequency: " + calculateFrequency(dataPoints[currentDataPointIndex].yPos) + " Hz";
  text(frequencyText, 10, 140);

  // Increment the index for the next data point
  currentDataPointIndex++;

  // Check if all data points are processed
  if (currentDataPointIndex >= dataPoints.length && !isNewInputAvailable()) {
    // Save the canvas as a PNG file when all data points are processed
    saveCanvas('drawing', 'png');
    continueAnimation = false; // Stop the animation after saving
  }

  // Dynamically adjust the canvas size based on the movement of the line
  if (dataPoints[currentDataPointIndex - 1].xPos - xOffset > canvasWidth) {
    canvasWidth += 100; // Increase the canvas width by 100 (adjust as needed)
    resizeCanvas(canvasWidth, canvasHeight);
  }

  // Stop the animation if continueAnimation is false
  if (!continueAnimation) {
    noLoop();
  }
  // Draw the direction indicator circle
  fill(directionIndicatorColor);
  ellipse(20, 250, 25, 25); // Adjust the position and size of the circle as needed
  

}

function isNewInputAvailable() {
  // Check if there is any new input available in the table
  // You can customize this based on your data structure
  // For example, check if there are new rows in the table
  return false; // Replace this with the actual condition
}
