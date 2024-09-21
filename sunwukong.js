const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameButton = document.getElementById('startGameButton');
const playAgainButton = document.getElementById('playAgainButton');

// Define the pixel size and the grid for the Sun Wukong character
const pixelSize = 3;  // Size of each pixel block

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

// Function to draw the sprite on the canvas
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

// Dino character
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

// Array to hold cactus obstacles
let obstacles = [];
let speedIncreaseRate = 0.01;  // Gradually increase the speed
let baseSpeed = -10;  // Initial speed

// Track when to generate the next cactus
let nextCactusTime = 0;

// Function to create random cacti
function createCactus() {
    const cactus = {
        x: canvas.width,
        y: 160,
        width: 20 + Math.random() * 10,
        height: 40 + Math.random() * 10,
        dx: baseSpeed,
        draw() {
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.x += this.dx;
            if (this.x + this.width < 0) {
                obstacles = obstacles.filter(ob => ob !== this);
            }
        }
    };
    obstacles.push(cactus);
}

// Function to generate obstacles based on time
function generateObstacles(timestamp) {
    if (timestamp >= nextCactusTime) {
        createCactus();
        nextCactusTime = timestamp + (500 + Math.random() * 1500);
    }
}

// Jumping logic
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && dino.grounded) {
        dino.grounded = false;
        dino.dy = dino.jump;
    }
});

// Check for collision
function isCollision(cactus) {
    return (
        dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x &&
        dino.y < cactus.y + cactus.height &&
        dino.y + dino.height > cactus.y
    );
}

// Game loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dino.draw();
    dino.update();

    generateObstacles(timestamp);

    obstacles.forEach(cactus => {
        cactus.draw();
        cactus.update();
        if (isCollision(cactus)) {
            cancelAnimationFrame(gameLoop);
            askToContinue();
        }
    });

    baseSpeed -= speedIncreaseRate;
    obstacles.forEach(cactus => cactus.dx = baseSpeed);

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Ask if the player wants to continue
function askToContinue() {
    const continueGame = confirm("Game Over! Do you want to continue?");
    if (continueGame) {
        resetGame();
        requestAnimationFrame(gameLoop);
    } else {
        playAgainButton.style.display = 'block'; // Show the "Play Again" button
        playAgainButton.onclick = function() {
            playAgainButton.style.display = 'none';

