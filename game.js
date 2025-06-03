const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, gridSize, gridSize);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawRect(food.x, food.y, "red");

  // Draw snake
  snake.forEach(segment => drawRect(segment.x, segment.y, "lime"));

  // Move snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    return;
  }

  snake.unshift(head);

  // Check for food consumption
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomPosition();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const key = event.key;
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

document.addEventListener("keydown", changeDirection);

function startGame() {
  snake = [{ x: 160, y: 160 }];
  direction = { x: gridSize, y: 0 };
  food = getRandomPosition();
  score = 0;
  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 100);
}

startGame();
