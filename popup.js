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

  let countdownInterval;

  // Handle 'YES, start now' button - skip all and start background process immediately
  startNowButton.addEventListener('click', function() {
    triggerBackgroundProcess(); // Skip everything and start the background task
  });

  // Handle 'NO, plan' button - show the registration time selection page
  planButton.addEventListener('click', function() {
    // Hide the startNowOrPlan section and show the registrationSection
    startNowOrPlanSection.classList.add('hidden');
    registrationSection.classList.remove('hidden');
  });

  // Handle 'Confirm Time' button
  confirmTimeButton.addEventListener('click', function() {
    const selectedTime = new Date(registrationTimeInput.value);

    // Check if the input is valid
    if (isNaN(selectedTime.getTime())) {
      alert('Please select a valid date and time.');
      return;
    }

    // Show the countdown section
    countdownSection.classList.remove('hidden');

    // Hide the registration time selection
    registrationSection.classList.add('hidden');

    // Start the countdown
    startCountdown(selectedTime);
  });

  startButton.addEventListener('click', function() {
    triggerBackgroundProcess(); // Start background process after countdown
  });

  function startCountdown(targetTime) {
    countdownInterval = setInterval(function() {
      const currentTime = new Date();
      const timeDifference = targetTime - currentTime;

      if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        countdownElement.textContent = '00:00';
        alert("Your registration time has arrived! Please proceed.");
        triggerBackgroundProcess();
        return;
      }

      const minutes = Math.floor((timeDifference / 1000) / 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function triggerBackgroundProcess() {
    alert("Started the background successfully");
    // Additional background processes can be added here
  }
});
