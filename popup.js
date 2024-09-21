document.addEventListener('DOMContentLoaded', function() {
  const confirmTimeButton = document.getElementById('confirmTimeButton');
  const startButton = document.getElementById('startButton');
  const countdownElement = document.getElementById('countdown');
  const countdownSection = document.getElementById('countdownSection');
  const registrationTimeSelect = document.getElementById('registrationTime');
  
  let countdownInterval;

  confirmTimeButton.addEventListener('click', function() {
    // Get the selected time from dropdown (in seconds)
    const selectedTime = parseInt(registrationTimeSelect.value, 10);
    
    // Start the countdown
    startCountdown(selectedTime);
    
    // Show the countdown section
    countdownSection.style.display = 'block';
    
    // Hide the registration time selection
    confirmTimeButton.style.display = 'none';
    registrationTimeSelect.style.display = 'none';
  });

  startButton.addEventListener('click', function() {
    // Show a reminder when the Start button is clicked
    alert("Started the background successfully");
    
    // Optional: Add a reminder 2 minutes before registration time
    setTimeout(() => {
      alert("Reminder: Your registration time is about to start!");
    }, 120000); // 120,000 ms = 2 minutes
  });

  function startCountdown(duration) {
    let timeRemaining = duration;
    
    countdownInterval = setInterval(function() {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;

      // Display the countdown in MM:SS format
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (timeRemaining === 0) {
        clearInterval(countdownInterval);
        alert("Your registration time has arrived! Please proceed.");
      }
      timeRemaining--;
    }, 1000); // 1000 ms = 1 second
  }
});
