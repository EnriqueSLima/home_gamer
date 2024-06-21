let blindsDuration;
let clock = document.getElementById("clock");
let round = document.getElementById("round_number");
let current_level = document.getElementById("current_level");
let next_level = document.getElementById("next_level");
const start_button = document.getElementById("start_button");

let small;
let big;
let clock_status = false; // tracks whether the clock is paused or not
let minutes;
let seconds;
let rounds_counter = 0;
let interval;

const ws = new WebSocket('ws://localhost:3000');

// Function to initialize the clock and tournament data
function initializeClock(blinds, sBlinds, bBlinds) {
  blindsDuration = blinds.map(duration => duration * 60); // Convert minutes to seconds
  small = sBlinds;
  big = bBlinds;
  if (blindsDuration && blindsDuration.length > 0) {
    minutes = parseInt(blindsDuration[rounds_counter] / 60, 10);
    seconds = parseInt(blindsDuration[rounds_counter] % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    current_level.innerHTML = small[0] + "/" + big[0];
    if (blindsDuration.length > 1) {
      next_level.innerHTML = small[1] + "/" + big[1];
    }
  } else {
    console.warn("Tournament duration input not yet available");
  }
}

// WebSocket event handler for receiving tournament data
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  initializeClock(data.blindsDuration, data.smallBlinds, data.bigBlinds);
};

// Function to start or stop the clock
function start_stop() {
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

// Function to update the timer every second
function update_timer() {
  if (blindsDuration[rounds_counter] === 0) {
    update_blinds();
  }
  minutes = parseInt(blindsDuration[rounds_counter] / 60, 10);
  seconds = parseInt(blindsDuration[rounds_counter] % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  clock.innerHTML = minutes + ":" + seconds;
  blindsDuration[rounds_counter]--;
}

// Function to update blinds and move to the next round
function update_blinds() {
  rounds_counter++;
  round.innerHTML = "Round " + (rounds_counter + 1);
  if (rounds_counter < small.length && rounds_counter < big.length) {
    current_level.innerHTML = small[rounds_counter] + " / " + big[rounds_counter];
    if (rounds_counter + 1 < small.length && rounds_counter + 1 < big.length) {
      next_level.innerHTML = small[rounds_counter + 1] + " / " + big[rounds_counter + 1];
    }
  } else {
    console.warn("Rounds and levels out of sync.");
  }
}

// Event listener for start/stop button click
start_button.onclick = start_stop;

// Function to save the current clock state and status
function saveClockState() {
  localStorage.setItem('tournament_clock', JSON.stringify({
    blindsDuration,
    small,
    big,
    rounds_counter,
    clock_status
  }));
}

// Function to load the saved clock state and status
function loadClockState() {
  const savedState = JSON.parse(localStorage.getItem('tournament_clock'));
  if (savedState) {
    blindsDuration = savedState.blindsDuration;
    small = savedState.small;
    big = savedState.big;
    rounds_counter = savedState.rounds_counter;
    clock_status = savedState.clock_status;

    // Initialize the clock with the loaded state
    initializeClock(blindsDuration, small, big);

    // Start or stop the clock based on the loaded status
    if (clock_status) {
      interval = setInterval(update_timer, 1000);
      start_button.innerHTML = "Stop";
    } else {
      start_button.innerHTML = "Start";
    }
  }
}

// Load clock state when the page loads
document.addEventListener('DOMContentLoaded', loadClockState);

// Save clock state when navigating away from the page
window.addEventListener('beforeunload', saveClockState);
