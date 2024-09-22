const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false; // Control game state

// Define the pixel size and the grid for the Sun Wukong character
const pixelSize = 10;  // Size of each pixel block

// Define the pixel grid for the Sun Wukong sprite
const wukongPixels = [
    ['#000000', '#000000', '#000000', null, null, '#000000', '#000000', '#000000'],
    ['#000000', '#FFDDC1', '#F9A602', '#D35400', '#D35400', '#F9A602', '#FFDDC1', '#000000'],
    ['#000000', '#D35400', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#D35400', '#000000'],
    ['#D35400', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#D35400'],
    ['#000000', '#F9A602', '#D35400', '#D35400', '#F9A602', '#D35400', '#F9A602', '#000000'],
    ['#000000', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#F9A602', '#000000'],
    [null, '#C0392B', '#C0392B', null, null, '#C0392B', '#C0392B', null],
    [null, '#C0392B', '#C0392B', null, null, '#C0392B', '#C0392B', null],
];

// Function to draw the Sun Wukong sprite on the canvas
function drawWukong(x, y) {
    for (let row = 0; row < wukongPixels.length; row++) {
        for (let col = 0; col < wukongPixels[row].length; col++) {
            const color = wukongPixels[row][col];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

// Sun Wukong character as Dino
const dino = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  dy: 0,
  gravity: 0.6,
  jump: -10,
  grounded: true,
  draw() {
    drawWukong(this.x, this.y);  // Draw Sun Wukong as the Dino character
  },
  update() {
    if (!this.grounded) {
      this.dy += this.gravity;
      this.y += this.dy;
      if (this.y >= 150) { // Ground level
        this.y = 150;
        this.grounded = true;
        this.dy = 0;
      }
    }
  }
};

// Cactus obstacle
const cactus = {
  x: 600,
  y: 160,
  width: 20,
  height: 40,
  dx: -5,
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  update() {
    this.x += this.dx;
    if (this.x < 0) {
      this.x = canvas.width;
    }
  }
};

// Game loop
function gameLoop() {
  if (!gameRunning) return; // Stop the game if not running

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dino.draw();
  dino.update();

  cactus.draw();
  cactus.update();

  if (isCollision()) {
    stopGame();
    alert("Game Over! Do you want to play again?");
    playAgainButton.style.display = 'block'; // Show the play again button
  } else {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
function startGame() {
  gameRunning = true;
  gameLoop();
}

// Stop the game
function stopGame() {
  gameRunning = false;
}

// Reset game state
function resetGame() {
  cactus.x = 600; // Reset cactus position
  dino.y = 150; // Reset Dino's position
  dino.grounded = true;
}

// Check for collision
function isCollision() {
  return (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height &&
    dino.y + dino.height > cactus.y
  );
}
