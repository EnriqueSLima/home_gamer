let blindsDuration;
let clock = document.getElementById("clock");
let round = document.getElementById("round_number");
let current_level = document.getElementById("current_level");
let next_level = document.getElementById("next_level");
let playerCountDisplay = document.getElementById("player_count_display");
let chipCountDisplay = document.getElementById("chip_count");
let averageDisplay = document.getElementById("average");
let potTotalDisplay = document.getElementById("pot_total");
let small;
let big;
let clock_status = false; // tracks whether the clock is paused or not
let minutes;
let seconds;
let rounds_counter = 0;
let interval;
const start_button = document.getElementById("start_button");

let players_left = 0;
let players_count = 0;
let chip_count = 0;
let average = 0;
let pot_total = 0;

const fetchTournamentSettings = new Promise((resolve, reject) => {
  console.log("DOM CONTENT LOADED");
  fetch('/tournament-settings')
    .then(response => response.text())
    .then(html => {
      var tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;
      blindsDuration = tempContainer.getElementsByClassName('time');
      small = tempContainer.getElementsByClassName("small_blind");
      big = tempContainer.getElementsByClassName("big_blind");
      console.log("Fetched blindsDuration:", blindsDuration); // Log for debugging
      resolve({ blindsDuration, small, big });
    })
    .catch(error => {
      console.error('Error fetching tournament settings:', error);
      reject(error);
    });
});

fetchTournamentSettings.then(() => {
  for (let index = 0; index < blindsDuration.length; index++) {
    blindsDuration[index].value *= 60;
  }
  !sessionStorage.getItem('current_tournament_settings') ? initializeClock() : loadTournamentSettings();
}).catch(error => {
  console.error('Error fetching tournament settings:', error);
});

function initializeClock() {
  if (blindsDuration && blindsDuration.length > 0) {
    minutes = parseInt(blindsDuration[rounds_counter].value / 60, 10);
    seconds = parseInt(blindsDuration[rounds_counter].value % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    current_level.innerHTML = small[0].value + "/" + big[0].value;
    next_level.innerHTML = small[1].value + "/" + big[1].value;
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
  if (blindsDuration[rounds_counter].value == 0) {
    update_blinds();
  }
  minutes = parseInt(blindsDuration[rounds_counter].value / 60, 10);
  seconds = parseInt(blindsDuration[rounds_counter].value % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  clock.innerHTML = minutes + ":" + seconds;
  blindsDuration[rounds_counter].value--;
  console.log(minutes);
  console.log(seconds);
  console.log(blindsDuration[rounds_counter].value);
}

function update_blinds() {
  rounds_counter++;
  round.innerHTML = "Round " + (rounds_counter + 1);
  current_level.innerHTML =
    small[rounds_counter].value + " / " + big[rounds_counter].value;
  next_level.innerHTML =
    small[rounds_counter + 1].value + " / " + big[rounds_counter + 1].value;
}

function saveTournamentSettings() {
  console.log("SAVE TOURNAMENT SETTINGS INVOKED");
  sessionStorage.setItem('current_tournament_settings', JSON.stringify({
    minutes: minutes,
    seconds: seconds,
    roundsCounter: rounds_counter,
    remainingTime: blindsDuration[rounds_counter].value,
    clockStatus: clock_status,
    playersLeft: players_left,
    playersCount: players_count,
    chipCount: chip_count,
    average: average,
    potTotal: pot_total
  }));
  console.log(sessionStorage.getItem('current_tournament_settings'));
}

function loadTournamentSettings() {
  console.log("LOAD TOURNAMENT SETTINGS INVOKED");
  const tournamentSettings = JSON.parse(sessionStorage.getItem('current_tournament_settings'));
  if (tournamentSettings) {
    rounds_counter = tournamentSettings.roundsCounter;
    blindsDuration[rounds_counter].value = tournamentSettings.remainingTime;
    minutes = parseInt(blindsDuration[rounds_counter].value / 60, 10);
    seconds = parseInt(blindsDuration[rounds_counter].value % 60, 10);
    clock_status = tournamentSettings.clockStatus;
    players_left = tournamentSettings.playersLeft;
    players_count = tournamentSettings.playersCount;
    chip_count = tournamentSettings.chipCount;
    average = tournamentSettings.average;
    pot_total = tournamentSettings.potTotal;
    clock.innerHTML = minutes + ":" + seconds;
    playerCountDisplay.innerHTML = `${players_left} / ${players_count}`;
    chipCountDisplay.innerHTML = chip_count;
    averageDisplay.innerHTML = average;
    potTotalDisplay.innerHTML = pot_total;
    if (clock_status) {
      interval = setInterval(update_timer, 1000);
      start_button.innerHTML = "Stop";
    } else {
      start_button.innerHTML = "Start";
    }
  }
}

start_button.onclick = start_stop;
window.addEventListener('beforeunload', saveTournamentSettings);

//sessionStorage.removeItem('current_tournament_settings');
