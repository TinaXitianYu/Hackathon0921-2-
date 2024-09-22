let nextCactusTime = 0;  // Track when the next cactus will be generated

// Function to create random cacti with more variation
function createCactus() {
    const cactus = {
        x: canvas.width,
        y: 160,
        width: 20 + Math.random() * 30, // Random width for more variation
        height: 40 + Math.random() * 20, // Random height for more variation
        dx: baseSpeed + Math.random() * 2, // Add slight random variation to speed
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

// Function to randomly generate obstacles
function generateObstacles(timestamp) {
    // Only generate a new cactus if the timestamp exceeds the nextCactusTime
    if (timestamp >= nextCactusTime) {
        createCactus();

        // Set the next cactus generation time to be between 0.5 to 2 seconds in the future
        nextCactusTime = timestamp + (500 + Math.random() * 1500);
    }
}

// Game loop (with obstacle generation based on time)
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dino.draw();
    dino.update();

    // Generate cacti based on random intervals
    generateObstacles(timestamp);

    // Update and draw obstacles
    obstacles.forEach(cactus => {
        cactus.draw();
        cactus.update();
        if (isCollision(cactus)) {
            alert("Game Over! Press OK to restart.");
            obstacles = []; // Clear all obstacles after collision
            baseSpeed = -5;  // Reset speed
            nextCactusTime = 0;  // Reset cactus generation time
        }
    });

    // Gradually increase speed over time
    baseSpeed -= speedIncreaseRate;
    obstacles.forEach(cactus => cactus.dx = baseSpeed);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
