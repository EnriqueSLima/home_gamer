let tournamentDurationInput;
let clock = document.getElementById("clock");
let clock_status = false; //tracks whether the clock is paused or not

// Create a promise that resolves when tournament duration input is available
const fetchTournamentDuration = new Promise((resolve, reject) => {
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
        // Resolve the promise with the tournamentDurationInput
        resolve(tournamentDurationInput);
      })
      .catch(error => {
        // Reject the promise if there's an error
        reject(error);
      });
  });
});

// Usage of tournamentDurationInput outside of the event listener
fetchTournamentDuration.then(input => {
  console.log(input); // Now you can use tournamentDurationInput here
  clock.innerHTML = tournamentDurationInput[0].value + ":00";

  let start_button = document.getElementById("start_button");
  let rounds_counter = 0;
  for (let index = 0; index < tournamentDurationInput.length; index++) {
    tournamentDurationInput[index].value = tournamentDurationInput[index].value * 60;
    console.log(tournamentDurationInput.value);
  }
  function start_stop() {
    console.log("start stop invoked")
    if (!clock_status) {
      interval = setInterval(update_timer, 1000);
      start_button.innerHTML = "Stop";
      clock_status = true;
    } else {
      clearInterval(interval);
      start_button.innerHTML = "Start";
      clock_status = false;
    }
  }
  function update_timer() {
    console.log("update timr invoked")
    // if (tournamentDurationInput[rounds_counter].value == 0) {
    //      let snd = new Audio("public/sounds/blindsup.mp3");
    //    snd.play();
    //  update_blinds();
    //  }

    let minutes = parseInt(tournamentDurationInput[rounds_counter].value / 60, 10);
    let seconds = parseInt(tournamentDurationInput[rounds_counter].value % 60, 10);
    console.log(minutes);
    console.log(seconds);
    console.log(rounds_counter);
    console.log(tournamentDurationInput[0]);
    console.log(tournamentDurationInput[1]);
    console.log(tournamentDurationInput[2].value);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    tournamentDurationInput[rounds_counter].value--;
  }

  start_button.onclick = start_stop;
}).catch(error => {
  console.error('Error fetching tournament settings:', error);
});

/*
function update_blinds() {
  rounds_counter++;
  round.innerHTML = "Round " + (rounds_counter + 1);
  current_level.innerHTML =
    small[rounds_counter].value + " / " + big[rounds_counter].value;
  next_level.innerHTML =
    small[rounds_counter + 1].value + " / " + big[rounds_counter + 1].value;
}
*/
