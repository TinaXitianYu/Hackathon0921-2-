document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function() {
    // Show a reminder alert when the Start button is clicked
    alert("Make sure your registration time is about to start!");
    
    // Optionally, you can also set a timer for a reminder if needed
    // Example: Show a reminder in 2 minutes
    setTimeout(() => {
      alert("Reminder: Your registration time is about to start!");
    }, 120000); // 120000 milliseconds = 2 minutes
  });
});
