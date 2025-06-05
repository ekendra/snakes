// Get canvas and context for drawing
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Size of each grid cell (snake segment and food)
const gridSize = 20;

// Snake is an array of segments, each with x and y position
let snake = [{ x: 160, y: 160 }];
// Current movement direction of the snake
let direction = { x: gridSize, y: 0 };
// Food position
let food = { x: 0, y: 0 };
// Player's score
let score = 0;
// Interval ID for the game loop
let gameInterval;

// References for score display and replay button
const scoreBox = document.getElementById('scoreBox');
const replayBtn = document.getElementById('replayBtn');


// Persistent high score for the user
let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);

// Update the high score display
function updateHighScore() {
  const highScoreBox = document.getElementById('highScoreBox');
  highScoreBox.textContent = `🏆 High Score: ${highScore}`;
}

// Check and update high score
function checkHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    updateHighScore();
  }
}

// Add high score display to the UI
const highScoreBox = document.createElement('div');
highScoreBox.id = 'highScoreBox';
highScoreBox.style.marginBottom = '10px';
highScoreBox.style.fontSize = '20px';
highScoreBox.style.fontWeight = 'bold';
highScoreBox.style.color = '#ffd700';
scoreBox.parentNode.insertBefore(highScoreBox, scoreBox);
updateHighScore();



// Generate a random position on the grid (aligned to gridSize)
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}


// Draw a filled rectangle at (x, y) with the given color
// If color is a CSS variable, use its value; otherwise use the color directly
function drawRect(x, y, color) {
  let fill = color;
  if (typeof color === 'string' && color.startsWith('--')) {
    // Get the CSS variable value and trim whitespace
    fill = getComputedStyle(document.documentElement).getPropertyValue(color).trim();
    // If the variable is not set or empty, fallback to a visible color
    if (!fill) fill = color === '--snake-color' ? '#e53935' : (color === '--food-color' ? '#1e88e5' : '#000');
  }
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, gridSize, gridSize);
}


// Main game loop: draw everything and update the snake
function draw() {
  // Fill the canvas background with faint yellow
  ctx.fillStyle = "#fffde7"; // faint yellow
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the food (blue by default)
  drawRect(food.x, food.y, "--food-color");

  // Draw the snake (red by default)
  snake.forEach(segment => drawRect(segment.x, segment.y, "--snake-color"));

  // Calculate new head position based on current direction
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions with walls or self
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    // Game over: stop the game loop and show final score
    clearInterval(gameInterval);
    scoreBox.textContent = `Game Over! Final Score: ${score}`;
    replayBtn.style.display = "block";
    checkHighScore();
    return;
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreBox.textContent = `Score: ${score}`;
    food = getRandomPosition();
    checkHighScore();
  } else {
    // Remove the tail if no food eaten
    snake.pop();
  }
}


// Handle arrow key presses to change snake direction
function changeDirection(event) {
  const key = event.key;
  // Prevent reversing direction
  if (key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: -gridSize };
  } else if (key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: gridSize };
  } else if (key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -gridSize, y: 0 };
  } else if (key === "ArrowRight" && direction.x === 0) {
    direction = { x: gridSize, y: 0 };
  }
}


// Listen for keyboard events to control the snake
document.addEventListener("keydown", changeDirection);


// Start or restart the game
function startGame() {
  // Reset snake to initial position
  snake = [{ x: 160, y: 160 }];
  // Start moving right
  direction = { x: gridSize, y: 0 };
  // Place food randomly
  food = getRandomPosition();
  // Reset score
  score = 0;
  // Update UI
  scoreBox.textContent = `Score: ${score}`;
  replayBtn.style.display = "none";
  // Stop any previous game loop
  clearInterval(gameInterval);
  // Start the game loop
  gameInterval = setInterval(draw, 100);
}


// When the replay button is clicked, restart the game
replayBtn.addEventListener('click', startGame);

// Start the game for the first time
startGame();