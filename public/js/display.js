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

// WebSocket event handler for receiving clock updates
ws.onopen = () => {
  console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.action === 'start') {
    handleClockStart();
  } else if (data.action === 'stop') {
    handleClockStop();
  } else if (data.blindsDuration && data.smallBlinds && data.bigBlinds) {
    initializeClock(data.blindsDuration, data.smallBlinds, data.bigBlinds);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

// Function to handle clock start action
function handleClockStart() {
  clearInterval(interval);
  interval = setInterval(update_timer, 1000);
  start_button.innerHTML = "Stop";
  clock_status = true;
}

// Function to handle clock stop action
function handleClockStop() {
  clearInterval(interval);
  start_button.innerHTML = "Start";
  clock_status = false;
}

// Function to send messages through WebSocket when ready
function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Unable to send message:', message);
  }
}

// Function to start or stop the clock
function start_stop() {
  if (!clock_status) {
    sendMessage({ action: 'start' });
    interval = setInterval(update_timer, 1000);
    start_button.innerHTML = "Stop";
    clock_status = true;
  } else {
    sendMessage({ action: 'stop' });
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
