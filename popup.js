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

  // Integrate sunwukong.js functions
  const startGameButton = document.getElementById('startGameButton');
  const playAgainButton = document.getElementById('playAgainButton');

  // Event listener for "Start Game" button
  startGameButton.addEventListener('click', function() {
    startGameButton.style.display = 'none'; // Hide the start button
    startGame(); // Start the game loop from sunwukong.js
  });

  // Event listener for "Play Again" button
  playAgainButton.addEventListener('click', function() {
    playAgainButton.style.display = 'none'; // Hide the button
    resetGame(); // Reset the game from sunwukong.js
    startGame(); // Restart the game loop
  });

  // Handle 'YES, start now' button - skip all and start background process immediately
  startNowButton.addEventListener('click', function() {
      triggerBackgroundProcess(); // Skip everything and start the background task
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
  });

  function startCountdown(targetTime) {
      countdownInterval = setInterval(function() {
          const currentTime = new Date();
          const timeDifference = targetTime - currentTime;

          if (timeDifference <= 0) {
              clearInterval(countdownInterval);
              countdownElement.textContent = '00:00:00';
              alert("It's registration time! Please proceed.");
              triggerBackgroundProcess();
              return;
          }

          const hours = Math.floor((timeDifference / 1000) / 3600);
          const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
          const seconds = Math.floor((timeDifference / 1000) % 60);
          countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          // Stop the game at 2 minutes and show a popup
          if (minutes === 2 && seconds === 0) {
              stopGame(); // Function from sunwukong.js to stop the game
              alert("Two minutes left!!");
          }
      }, 1000);
  }

  function triggerBackgroundProcess() {
      alert("Grabbing Started");
      // Add additional background processes if needed
      chrome.runtime.sendMessage({action: "startBackgroundProcess"}, function(response) {
          console.log(response.status); // Log response from background script
      });
  }
});
