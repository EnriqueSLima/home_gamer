let tournamentDurationInput;
let clock = document.getElementById("clock");
let round = document.getElementById("round_number");
let current_level = document.getElementById("current_level");
let next_level = document.getElementById("next_level");
let small;
let big;
let clock_status = false; //tracks whether the clock is paused or not
let minutes;
let seconds;

// Create a promise that resolves when tournament duration input is available
const fetchTournamentSettings = new Promise((resolve, reject) => {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM CONTENT LOADED");
    // Fetch the tournament duration from the server
    fetch('/tournament-settings')
      .then(response => response.text())
      .then(html => {
        // Create a temporary container element to parse the HTML
        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;

        // Find the tournament duration input
        tournamentDurationInput = tempContainer.getElementsByClassName('time');
        small = tempContainer.getElementsByClassName("small_blind");
        big = tempContainer.getElementsByClassName("big_blind");
        // Resolve the promise with the tournamentDurationInput
        resolve(tournamentDurationInput, small, big);
      })
      .catch(error => {
        // Reject the promise if there's an error
        reject(error);
      });
  });
});

// Usage of tournamentDurationInput outside of the event listener
fetchTournamentSettings.then(input => {
  console.log(input);
  clock.innerHTML = tournamentDurationInput[0].value + ":00";
  current_level.innerHTML = small[0].value + "/" + big[0].value;
  next_level.innerHTML = small[1].value + "/" + big[1].value;

  let start_button = document.getElementById("start_button");
  let rounds_counter = 0;
  for (let index = 0; index < tournamentDurationInput.length; index++) {
    tournamentDurationInput[index].value *= 60;
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
    console.log("update timer invoked")
    if (tournamentDurationInput[rounds_counter].value == 0) {
      //      let snd = new Audio("public/sounds/blindsup.mp3");
      //    snd.play();
      update_blinds();
    }

    minutes = parseInt(tournamentDurationInput[rounds_counter].value / 60, 10);
    seconds = parseInt(tournamentDurationInput[rounds_counter].value % 60, 10);
    console.log(minutes);
    console.log(seconds);
    // console.log(rounds_counter);
    // console.log(tournamentDurationInput[0].value);
    // console.log(tournamentDurationInput[1]);
    //console.log(tournamentDurationInput[2].value);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    tournamentDurationInput[rounds_counter].value--;
    console.log(tournamentDurationInput[rounds_counter].value);
  }

  function update_blinds() {
    rounds_counter++;
    round.innerHTML = "Round " + (rounds_counter + 1);
    current_level.innerHTML =
      small[rounds_counter].value + " / " + big[rounds_counter].value;
    next_level.innerHTML =
      small[rounds_counter + 1].value + " / " + big[rounds_counter + 1].value;
  }
  start_button.onclick = start_stop;

  // Function to save timer state to localStorage
  function saveTimerState() {
    console.log("SAVE TIMER INVOKED")
    localStorage.setItem('timerState', JSON.stringify({
      minutes: minutes,
      seconds: seconds,
      roundsCounter: rounds_counter,
      remainingTime: tournamentDurationInput[rounds_counter].value,
      clockStatus: clock_status
    }));
  }

  function loadTimerState() {
    console.log("LOAD TIMER INVOKED")
    const timerState = JSON.parse(localStorage.getItem('timerState'));
    if (timerState) {
      clock.innerHTML = timerState.minutes + ':' + timerState.seconds;
      rounds_counter = timerState.roundsCounter;
      tournamentDurationInput[rounds_counter].value = timerState.remainingTime;
      clock_status = timerState.clockStatus;
      if (clock_status) {
        start_stop(); // Resume the timer if it was running
      }
    }
  }

  // Call loadTimerState() when the page loads
  window.addEventListener('load', loadTimerState);

  // Call saveTimerState() when changing views
  window.addEventListener('beforeunload', saveTimerState);

  // Call saveTimerState() when navigating away using links/buttons
  const links = document.querySelectorAll('a');
  for (let link of links) {
    link.addEventListener('click', saveTimerState);
  }
}).catch(error => {
  console.error('Error fetching tournament settings:', error);
});

