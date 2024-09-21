document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');
  const inputField = document.getElementById('registrationTime');

  // Add event listener for the Go button
  goButton.addEventListener('click', function() {
    const registrationTime = inputField.value;

    if (registrationTime) {
      // You can add any logic here, for now, we'll just log it
      console.log(`Your registration time is: ${registrationTime}`);
      alert(`Your registration time is: ${registrationTime}`);
    } else {
      alert("Please enter a valid time.");
    }
  });
});
