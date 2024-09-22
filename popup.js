
document.addEventListener('DOMContentLoaded', function() {
  const startNowOrPlanSection = document.getElementById('startNowOrPlanSection');
  const registrationSection = document.getElementById('registrationSection');
  const countdownSection = document.getElementById('countdownSection');
  const startNowButton = document.getElementById('startNowButton');
  const planButton = document.getElementById('planButton');
  const confirmTimeButton = document.getElementById('confirmTimeButton');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const stopProgramButton = document.getElementById('stopProgramButton');
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
      if (!gameRunning) return; // Stop the game if not running

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
  function startGame() {
      gameRunning = true;
      gameLoop();
  }

  // Stop the game
  function stopGame() {
      gameRunning = false;
  }

  // Handle 'YES, start now' button - skip all and start background process immediately
  startNowButton.addEventListener('click', function() {
      triggerBackgroundProcess(); // Skip everything and start the background task
      stopButton.classList.remove('hidden');
      planButton.classList.add('hidden');
  });

  stopButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'stop' }, function(response) {
            console.log(response.status);
        });
    });

  
  // Handle 'NO, plan' button - show the registration time selection page
  planButton.addEventListener('click', function() {
      startNowOrPlanSection.classList.add('hidden');
      registrationSection.classList.remove('hidden');
  });

  // Handle 'Confirm Time' button
  confirmTimeButton.addEventListener('click', function() {
      const selectedTime = new Date(registrationTimeInput.value);

      if (isNaN(selectedTime.getTime())) {
          alert('Please select a valid date and time.');
          return;
      }

      countdownSection.classList.remove('hidden');
      registrationSection.classList.add('hidden');

      startCountdown(selectedTime);
      startGame();
  });

  startButton.addEventListener('click', function() {
      triggerBackgroundProcess();
      stopGame();
      stopProgramButton.classList.remove('hidden');
  });

  stopProgramButton.addEventListener('click', function() {
      stopGame();  // Stop the game
      chrome.runtime.sendMessage({ action: 'stop' }, function(response) {
          console.log("Program stopped:", response.status);
      });
  });
  
  function startCountdown(targetTime) {
      countdownInterval = setInterval(function() {
          const currentTime = new Date();
          const timeDifference = targetTime - currentTime;

          if (timeDifference <= 0) {
              clearInterval(countdownInterval);
              countdownElement.textContent = '00:00:00';
              triggerBackgroundProcess();
              alert("It's registration time! Please proceed.");
              stopGame();
              stopButton.classList.remove('hidden');
              return;
          }

          const hours = Math.floor((timeDifference / 1000) / 3600);
          const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
          const seconds = Math.floor((timeDifference / 1000) % 60);
          countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          // Stop the game at 2 minutes and show a popup
          if (minutes === 2 && seconds === 0) {
              stopGame();
              alert("Two minutes left!!");
          }
      }, 1000);
  }

  function triggerBackgroundProcess() {
      alert("Grabbing Started");
      chrome.runtime.sendMessage({action: "startBackgroundProcess"}, function(response) {
          console.log(response.status);
      });
  }
});
