let dataPoints1 = []; // For the first line (Violoncello - green)
let dataPoints2 = []; // For the second line (Viola - red)
let dataPoints3 = []; // For the third line (Violin - black)
let dataPoints4 = []; // For the fourth line (Violin 2 - blue)
let currentDataPointIndex1 = 0;
let currentDataPointIndex2 = 0;
let currentDataPointIndex3 = 0;
let currentDataPointIndex4 = 0;
let oldDataPointIndex1 = 0;
let oldDataPointIndex2 = 0;
let oldDataPointIndex3 = 0;
let oldDataPointIndex4 = 0;
let frameRateValue = 45;
let continueAnimation = true;
let canvasWidth = 1920;
let canvasHeight = 1080;
let directionIndicatorColor;
let directionChangeCounter = 0;
let previousDirection = "left";
let previousVelocity = 0;
let xOffset = -600; // Adjust this value to move the entire visualization to the right
let exportInterval = 15 * frameRateValue; // Export every 15 seconds

// Load the "inktrap.otf" font
let inktrapFont;

function preload() {
  inktrapFont = loadFont('inktrap.otf');

  loadTable("v2.csv", "csv", "header", function(table) {
    dataPoints1 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  loadTable("v1.csv", "csv", "header", function(table) {
    dataPoints2 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  loadTable("cello.csv", "csv", "header", function(table) {
    dataPoints3 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  loadTable("vla.csv", "csv", "header", function(table) {
    dataPoints4 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(frameRateValue);
  directionIndicatorColor = color(0, 255, 0); // Initial color (green)
  textFont(inktrapFont); // Apply the custom font to all text
}

// Add event listeners to the toggle switches
document.getElementById("toggleVioloncelloLine").addEventListener("change", toggleVioloncelloLine);
document.getElementById("toggleViolaLine").addEventListener("change", toggleViolaLine);
document.getElementById("toggleViolinLine").addEventListener("change", toggleViolinLine);
document.getElementById("toggleViolin2Line").addEventListener("change", toggleViolin2Line);

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

function toggleViolin2Line() {
    redraw(); // Redraw the canvas when the toggle state changes
}

function draw() {
    background(255);

    // Check the state of the toggle switches and draw the lines accordingly
    if (document.getElementById("toggleVioloncelloLine").checked) {
        drawLine1(); // Draw Violoncello line if the checkbox is checked
    }
    if (document.getElementById("toggleViolaLine").checked) {
        drawLine2(); // Draw Viola line if the checkbox is checked
    }
    if (document.getElementById("toggleViolinLine").checked) {
        drawLine3(); // Draw Violin line if the checkbox is checked
    }
    if (document.getElementById("toggleViolin2Line").checked) {
        drawLine4(); // Draw Violin 2 line if the checkbox is checked
    }

    // Rest of your code for drawing dots, direction indicators, and so on...

    // Increment the index for the next data points for each line independently
    currentDataPointIndex1++;
    currentDataPointIndex2++;
    currentDataPointIndex3++;
    currentDataPointIndex4++;

    // Check if all data points are processed for all lines
    if (currentDataPointIndex1 >= dataPoints1.length && currentDataPointIndex2 >= dataPoints2.length && currentDataPointIndex3 >= dataPoints3.length && currentDataPointIndex4 >= dataPoints4.length && !isNewInputAvailable()) {
        // Save the canvas as a PNG file when all data points are processed
        saveCanvas('drawing', 'png');
        continueAnimation = false; // Stop the animation after saving
    }

    // Stop the animation if continueAnimation is false
    if (!continueAnimation) {
        noLoop();
    }
}

function drawLine1() {
    // Move old points to the left for the first line (Violoncello - green)
    for (let i = oldDataPointIndex1; i < currentDataPointIndex1; i++) {
        const sec = 213 / 25;
        dataPoints1[i].xPos -= sec * 0.25;
    }

    // Draw the first line (Violoncello - green)
    stroke(27, 38, 59); // Green color for Violoncello
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 1; i <= currentDataPointIndex1; i++) {
        vertex(dataPoints1[i].xPos - xOffset, dataPoints1[i].yPos);
    }
    endShape();

    // Draw dots for each data point with the respective color
    drawDots(dataPoints1.slice(1, currentDataPointIndex1), color(27, 38, 59));
}

function drawLine2() {
    // Move old points to the left for the second line (Viola - red)
    for (let i = oldDataPointIndex2; i < currentDataPointIndex2; i++) {
        const sec = 213 / 25;
        dataPoints2[i].xPos -= sec * 0.25;
    }

    // Draw the second line (Viola - red)
    stroke(65, 90, 119); // Red color for Viola
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 1; i <= currentDataPointIndex2; i++) {
        vertex(dataPoints2[i].xPos - xOffset, dataPoints2[i].yPos);
    }
    endShape();

    // Draw dots for each data point with the respective color
    drawDots(dataPoints2.slice(1, currentDataPointIndex2), color(65, 90, 119));
}

function drawLine3() {
    // Move old points to the left for the third line (Violin - black)
    for (let i = oldDataPointIndex3; i < currentDataPointIndex3; i++) {
        const sec = 213 / 25;
        dataPoints3[i].xPos -= sec * 0.25;
    }

    // Draw the third line (Violin - black)
    stroke(119, 141, 169); // Black color for Violin
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 1; i <= currentDataPointIndex3; i++) {
        vertex(dataPoints3[i].xPos - xOffset, dataPoints3[i].yPos);
    }
    endShape();

    // Draw dots for each data point with the respective color
    drawDots(dataPoints3.slice(1, currentDataPointIndex3), color(119, 141, 169));
}

function drawLine4() {
    // Move old points to the left for the fourth line (Violin 2 - blue)
    for (let i = oldDataPointIndex4; i < currentDataPointIndex4; i++) {
        const sec = 213 / 25;
        dataPoints4[i].xPos -= sec * 0.25;
    }

    // Draw the fourth line (Violin 2 - blue)
    stroke(202, 240, 248); // Blue color for Violin 2
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 1; i <= currentDataPointIndex4; i++) {
        vertex(dataPoints4[i].xPos - xOffset, dataPoints4[i].yPos);
    }
    endShape();

    // Draw dots for each data point with the respective color
    drawDots(dataPoints4.slice(1, currentDataPointIndex4), color(202, 240, 248));
}

function drawDots(dataPoints, dotColor) {
    fill(dotColor); // Set dot color to the respective color
    noStroke();
    for (let i = 0; i < dataPoints.length; i++) {
        ellipse(dataPoints[i].xPos - xOffset, dataPoints[i].yPos, 5, 5); // Adjust the size of the dot as needed
    }
}

document.getElementById("goBackButton").addEventListener("click", function() {
    // Redirect to the home page (index.html)
    window.location.href = "../index.html";
});

function isNewInputAvailable() {
    // Check if there is any new input available in the table
    // You can customize this based on your data structure
    // For example, check if there are new rows in the table
    return false; // Replace this with the actual condition
}
