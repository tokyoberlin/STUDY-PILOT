let dataPoints1 = []; // For the first line (Cello)
let dataPoints2 = []; // For the second line (Viola)
let dataPoints3 = []; // For the third line (Violin)
let currentDataPointIndex1 = 0;
let currentDataPointIndex2 = 0;
let currentDataPointIndex3 = 0;
let oldDataPointIndex1 = 0;
let oldDataPointIndex2 = 0;
let oldDataPointIndex3 = 0;
let frameRateValue = 25;
let continueAnimation = true;
let canvasWidth = 1920;
let canvasHeight = 1080;
let xOffset = -900; // Adjust this value to move the entire visualization to the right

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
}

function draw() {
  background(255);

  // Draw all three lines and their respective positions
  drawLine(dataPoints1, color(0, 0, 255), "Cello", currentDataPointIndex1);
  drawLine(dataPoints2, color(255, 0, 0), "Viola", currentDataPointIndex2);
  drawLine(dataPoints3, color(0, 255, 0), "Violin", currentDataPointIndex3);

  // Increment the index for the next data points for each line independently
  currentDataPointIndex1++;
  currentDataPointIndex2++;
  currentDataPointIndex3++;

  // Dynamically adjust the canvas size based on the movement of the lines
  if (
    Math.max(
      dataPoints1[currentDataPointIndex1 - 1].xPos,
      dataPoints2[currentDataPointIndex2 - 1].xPos,
      dataPoints3[currentDataPointIndex3 - 1].xPos
    ) - xOffset > canvasWidth
  ) {
    canvasWidth += 100; // Increase the canvas width by 100 (adjust as needed)
    resizeCanvas(canvasWidth, canvasHeight);
  }

  // Stop the animation if continueAnimation is false
  if (!continueAnimation) {
    noLoop();
  }
}

function drawLine(dataPoints, lineColor, label, currentIndex) {
  // Move old points to the left for the line
  for (let i = oldDataPointIndex1; i < currentIndex; i++) {
    const sec = 213 / 25;
    dataPoints[i].xPos -= sec * 0.25;
  }

  // Draw the line
  stroke(lineColor);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 1; i <= currentIndex; i++) {
    vertex(dataPoints[i].xPos - xOffset, dataPoints[i].yPos);
  }
  endShape();

  // Display x and y positions for the current line
  fill(lineColor);
  textSize(16);
  text(label + " - X Position: " + dataPoints[currentIndex].xPos.toFixed(2), 20, height - 60);
  text(label + " - Y Position: " + dataPoints[currentIndex].yPos.toFixed(2), 20, height - 40);

  // Update the old data point index for the current line
  oldDataPointIndex1 = currentIndex;
}
