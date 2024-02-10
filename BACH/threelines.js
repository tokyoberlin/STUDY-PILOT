let dataPoints1 = []; // For the first line
let dataPoints2 = []; // For the second line
let dataPoints3 = []; // For the third line
let shiftedDataPoints1 = []; // Shifted data points for the first line
let shiftedDataPoints2 = []; // Shifted data points for the second line
let shiftedDataPoints3 = []; // Shifted data points for the third line
let currentDataPointIndex1 = 0;
let currentDataPointIndex2 = 0;
let currentDataPointIndex3 = 0;
let oldDataPointIndex1 = 0;
let oldDataPointIndex2 = 0;
let oldDataPointIndex3 = 0;
let frameRateValue = 65;
let continueAnimation = true;
let canvasWidth = 1920;
let canvasHeight = 1080;
let directionIndicatorColor;
let directionChangeCounter = 0;
let previousDirection = "left";
let previousVelocity = 0;
let xOffset = -800; // Adjust this value to move the entire visualization to the right
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

  // Initialize shifted data points
  shiftedDataPoints1 = dataPoints1.map(point => ({xPos: point.xPos, yPos: point.yPos}));
  shiftedDataPoints2 = dataPoints2.map(point => ({xPos: point.xPos, yPos: point.yPos}));
  shiftedDataPoints3 = dataPoints3.map(point => ({xPos: point.xPos, yPos: point.yPos}));
}

// Add event listeners to the toggle switches
document.getElementById("toggleVioloncelloLine").addEventListener("change", toggleVioloncelloLine);
document.getElementById("toggleViolaLine").addEventListener("change", toggleViolaLine);
document.getElementById("toggleViolinLine").addEventListener("change", toggleViolinLine);

// Functions to handle toggle switch changes
function toggleVioloncelloLine() {
    redraw(); // Redraw the canvas when the toggle state changes
}

function toggleViolaLine() {
    redraw(); // Redraw the canvas when the toggle state changes
}

function toggleViolinLine() {
    redraw(); // Redraw the canvas when the toggle state changes
}

function draw() {
    background(255);

    // Move all points to the left for all lines
    const sec = 213 / 25;
    for (let i = 0; i < currentDataPointIndex1; i++) {
        dataPoints1[i].xPos -= sec * 0.25;
        dataPoints2[i].xPos -= sec * 0.25;
        dataPoints3[i].xPos -= sec * 0.25;

        // Update shifted data points
        shiftedDataPoints1[i] = {xPos: dataPoints1[i].xPos, yPos: dataPoints1[i].yPos};
        shiftedDataPoints2[i] = {xPos: dataPoints2[i].xPos, yPos: dataPoints2[i].yPos};
        shiftedDataPoints3[i] = {xPos: dataPoints3[i].xPos, yPos: dataPoints3[i].yPos};
    }

    // Check the state of the toggle switches and draw the lines accordingly
    if (document.getElementById("toggleVioloncelloLine").checked) {
        drawLine(shiftedDataPoints1, color(119, 141, 169)); // Violoncello line with blue color
    }
    if (document.getElementById("toggleViolaLine").checked) {
        drawLine(shiftedDataPoints2, color(27, 38, 59)); // Viola line with red color
    }
    if (document.getElementById("toggleViolinLine").checked) {
        drawLine(shiftedDataPoints3, color(86, 207, 225)); // Violin line with green color
    }

    // Rest of your code for drawing dots, direction indicators, and so on...

    // Increment the index for the next data points for each line independently
    currentDataPointIndex1++;
    currentDataPointIndex2++;
    currentDataPointIndex3++;

    // Check if all data points are processed for all lines
    if (currentDataPointIndex1 >= dataPoints1.length && currentDataPointIndex2 >= dataPoints2.length && currentDataPointIndex3 >= dataPoints3.length && !isNewInputAvailable()) {
        // Save the canvas as a PNG file when all data points are processed
        saveCanvas('drawing', 'png');
        continueAnimation = false; // Stop the animation after saving
    }

    // Stop the animation if continueAnimation is false
    if (!continueAnimation) {
        noLoop();
    }
}

// Function to draw a line based on dataPoints and color
function drawLine(dataPoints, lineColor) {
  stroke(lineColor);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 1; i <= currentDataPointIndex1; i++) {
    vertex(dataPoints[i].xPos - xOffset, dataPoints[i].yPos);
  }
  endShape();
}

function isNewInputAvailable() {
    // Check if there is any new input available in the table
    // You can customize this based on your data structure
    // For example, check if there are new rows in the table
    return false; // Replace this with the actual condition
}
