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

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  blindsDuration = data.blindsDuration.map(duration => duration * 60); // Convert minutes to seconds
  small = data.smallBlinds;
  big = data.bigBlinds;
  initializeClock();
};

function initializeClock() {
  if (blindsDuration && blindsDuration.length > 0) {
    minutes = parseInt(blindsDuration[rounds_counter] / 60, 10);
    seconds = parseInt(blindsDuration[rounds_counter] % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    current_level.innerHTML = small[0] + "/" + big[0];
    next_level.innerHTML = small[1] + "/" + big[1];
  } else {
    console.warn("Tournament duration input not yet available");
  }
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
  if (blindsDuration[rounds_counter] == 0) {
    update_blinds();
  }
  minutes = parseInt(blindsDuration[rounds_counter] / 60, 10);
  seconds = parseInt(blindsDuration[rounds_counter] % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  clock.innerHTML = minutes + ":" + seconds;
  blindsDuration[rounds_counter]--;
  console.log(minutes);
  console.log(seconds);
  console.log(blindsDuration[rounds_counter]);
}

function update_blinds() {
  rounds_counter++;
  round.innerHTML = "Round " + (rounds_counter + 1);
  current_level.innerHTML =
    small[rounds_counter] + " / " + big[rounds_counter];
  next_level.innerHTML =
    small[rounds_counter + 1] + " / " + big[rounds_counter + 1];
}

start_button.onclick = start_stop;
