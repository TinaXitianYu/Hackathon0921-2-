const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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

// Jumping logic
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && dino.grounded) {
        dino.grounded = false;
        dino.dy = dino.jump;
    }
});

// Check for collision
function isCollision() {
    return (
        dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x &&
        dino.y < cactus.y + cactus.height &&
        dino.y + dino.height > cactus.y
    );
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dino.draw();
    dino.update();

    cactus.draw();
    cactus.update();

    if (isCollision()) {
        alert("Game Over! Press OK to restart.");
        cactus.x = 600; // Reset the cactus position
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
