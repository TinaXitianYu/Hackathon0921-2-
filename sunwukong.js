const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the dino image
const dinoImage = new Image();
dinoImage.src = 'path/to/your/dino-image.png';  // Use the correct path to the uploaded image

// Dino character
const dino = {
    x: 50,
    y: 150,
    width: 40,  // Update this to match your image dimensions
    height: 40, // Update this to match your image dimensions
    dy: 0,
    gravity: 0.6,
    jump: -10,
    grounded: true,
    draw() {
        ctx.drawImage(dinoImage, this.x, this.y, this.width, this.height); // Draw the image
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
        width: 20 + Math.random() * 10, // Random width for more variation
        height: 40 + Math.random() * 10, // Random height for more variation
        dx: baseSpeed, // Initial speed
        draw() {
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.x += this.dx;
            if (this.x + this.width < 0) {
                // Remove the cactus when it goes off-screen
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
        // Set next cactus time between 0.5 and 2 seconds
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

    // Create random obstacles based on time
    generateObstacles(timestamp);

    // Update and draw obstacles
    obstacles.forEach(cactus => {
        cactus.draw();
        cactus.update();
        if (isCollision(cactus)) {
            alert("Game Over! Press OK to restart.");
            resetGame();
        }
    });

    // Gradually increase speed over time
    baseSpeed -= speedIncreaseRate;
    obstacles.forEach(cactus => cactus.dx = baseSpeed);

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Reset game state
function resetGame() {
    obstacles = []; // Clear obstacles
    baseSpeed = -7;  // Reset speed
    nextCactusTime = 0; // Reset cactus generation timer
    dino.y = 150;  // Reset dino's position
    dino.grounded = true;
}

// Start the game when the image is loaded
dinoImage.onload = function() {
    requestAnimationFrame(gameLoop);
};
