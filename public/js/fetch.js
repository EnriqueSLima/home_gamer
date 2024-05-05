
let tournamentDurationInput;
document.addEventListener('DOMContentLoaded', function() {
  // Fetch the tournament duration from the server
  fetch('/tournament-settings')
    .then(response => response.text())
    .then(html => {
      // Create a temporary container element to parse the HTML
      var tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      // Find the tournament duration input
      tournamentDurationInput = tempContainer.getElementsByClassName('time');

      // Get the clock element
      var clockElement = document.getElementById('clock');

      // Set the initial clock value
      clockElement.textContent = tournamentDurationInput[0].value;

      // Listen for changes in the tournament duration input
      // tournamentDurationInput.addEventListener('input', function() {
      // Update the clock value whenever the input changes
      //   clockElement.textContent = tournamentDurationInput.value;
      // });
    })
    .catch(error => {
      console.error('Error fetching tournament settings:', error);
    });
});

console.log(tournamentDurationInput);
