document.addEventListener('DOMContentLoaded', function() {
  const startNowOrPlanSection = document.getElementById('startNowOrPlanSection');
  const registrationSection = document.getElementById('registrationSection');
  const countdownSection = document.getElementById('countdownSection');
  const startNowButton = document.getElementById('startNowButton');
  const planButton = document.getElementById('planButton');
  const confirmTimeButton = document.getElementById('confirmTimeButton');
  const startButton = document.getElementById('startButton');
  const countdownElement = document.getElementById('countdown');
  const registrationTimeInput = document.getElementById('registrationTime');

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let countdownInterval;
  let gameInterval;
  let gameRunning = true;

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
              if (this.y >= 150) {
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
