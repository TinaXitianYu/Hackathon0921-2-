document.addEventListener('DOMContentLoaded', function() {
  const confirmTimeButton = document.getElementById('confirmTimeButton');
  const startButton = document.getElementById('startButton');
  const countdownElement = document.getElementById('countdown');
  const countdownSection = document.getElementById('countdownSection');
  const registrationTimeInput = document.getElementById('registrationTime');

  let countdownInterval;

  confirmTimeButton.addEventListener('click', function() {
    // Get the selected date and time from input
    const selectedTime = new Date(registrationTimeInput.value);

    // Check if the input is valid
    if (isNaN(selectedTime.getTime())) {
      alert('Please select a valid date and time.');
      return;
    }

    // Show the countdown section
    countdownSection.style.display = 'block';

    // Hide the registration time selection
    confirmTimeButton.style.display = 'none';
    registrationTimeInput.style.display = 'none';

    // Start the countdown
    startCountdown(selectedTime);
  });

  startButton.addEventListener('click', function() {
    alert("Started the background successfully");

    // Optional: Add a reminder 2 minutes before registration time
    setTimeout(() => {
      alert("Reminder: Your registration time is about to start!");
    }, 120000); // 120,000 ms = 2 minutes
  });

  function startCountdown(targetTime) {
    countdownInterval = setInterval(function() {
      const currentTime = new Date();
      const timeDifference = targetTime - currentTime;

      if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        countdownElement.textContent = '00:00';
        alert("Your registration time has arrived! Please proceed.");
        return;
      }

      // Convert timeDifference from milliseconds to minutes and seconds
      const minutes = Math.floor((timeDifference / 1000) / 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      // Display the countdown in MM:SS format
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000); // 1000 ms = 1 second
  }
});
