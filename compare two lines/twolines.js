let dataPoints1 = []; // For the first line
let dataPoints2 = []; // For the second line
let currentDataPointIndex1 = 0;
let currentDataPointIndex2 = 0;
let oldDataPointIndex1 = 0;
let oldDataPointIndex2 = 0;
let frameRateValue = 25;
let continueAnimation = true;
let canvasWidth = 1920;
let canvasHeight = 1080;
let directionIndicatorColor;
let directionChangeCounter = 0;
let previousDirection = "left";
let previousVelocity = 0;
let xOffset = -900; // Adjust this value to move the entire visualization to the right
let exportInterval = 15 * frameRateValue; // Export every 15 seconds

function preload() {
  loadTable("cello track.csv", "csv", "header", function(table) {
    dataPoints1 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  loadTable("viola track.csv", "csv", "header", function(table) {
    dataPoints2 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  loadTable("violin track.csv", "csv", "header", function(table) {
    dataPoints3 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });
}


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(frameRateValue);
  directionIndicatorColor = color(0, 255, 0); // Initial color (green)
  textSize(20); // Set the text size
}

function draw() {
  background(255);

  // Draw the text and circles in the top left corner
  fill(0); // Black color
  ellipse(30, 40, 40, 40); // Black circle
  fill(255, 0, 0); // Red color
  ellipse(30, 100, 40, 40); // Red circle
  fill(0); // Black color
  text("Violoncello", 80, 50); // Text "Violoncello"
  text("Viola", 80, 105); // Text "Viola"

  // Check the state of the toggle switches and draw the lines accordingly
  if (document.getElementById("toggleVioloncelloLine").checked) {
    drawLine1(); // Draw Violoncello line if the checkbox is checked
  }
  if (document.getElementById("toggleViolaLine").checked) {
    drawLine2(); // Draw Viola line if the checkbox is checked
  }

  // Rest of your code for drawing dots, direction indicators, and so on...
  
  // Increment the index for the next data points for each line independently
  currentDataPointIndex1++;
  currentDataPointIndex2++;

  // Check if all data points are processed for both lines
  if (currentDataPointIndex1 >= dataPoints1.length && currentDataPointIndex2 >= dataPoints2.length && !isNewInputAvailable()) {
    // Save the canvas as a PNG file when all data points are processed
    saveCanvas('drawing', 'png');
    continueAnimation = false; // Stop the animation after saving
  }

  // Dynamically adjust the canvas size based on the movement of the lines
  if (Math.max(dataPoints1[currentDataPointIndex1 - 1].xPos, dataPoints2[currentDataPointIndex2 - 1].xPos) - xOffset > canvasWidth) {
    canvasWidth += 100; // Increase the canvas width by 100 (adjust as needed)
    resizeCanvas(canvasWidth, canvasHeight);
  }

  // Stop the animation if continueAnimation is false
  if (!continueAnimation) {
    noLoop();
  }
}



function drawLine1() {
  // Move old points to the left for the first line
  for (let i = oldDataPointIndex1; i < currentDataPointIndex1; i++) {
    const sec = 213 / 25;
    dataPoints1[i].xPos -= sec * 0.25;
  }

  // Draw the first line
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 1; i <= currentDataPointIndex1; i++) {
    vertex(dataPoints1[i].xPos - xOffset, dataPoints1[i].yPos);
  }
  endShape();
}

function drawLine2() {
  // Move old points to the left for the second line
  for (let i = oldDataPointIndex2; i < currentDataPointIndex2; i++) {
    const sec = 213 / 25;
    dataPoints2[i].xPos -= sec * 0.25;
  }

  // Draw the second line
  stroke(255, 0, 0); // Change color for the second line (e.g., red)
  beginShape();
  for (let i = 1; i <= currentDataPointIndex2; i++) {
    vertex(dataPoints2[i].xPos - xOffset, dataPoints2[i].yPos);
  }
  endShape();
}



function isNewInputAvailable() {
  // Check if there is any new input available in the table
  // You can customize this based on your data structure
  // For example, check if there are new rows in the table
  return false; // Replace this with the actual condition
}

