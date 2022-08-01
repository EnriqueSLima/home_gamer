// MAIN CONTENT VARIABLES
let settings_button = document.getElementById("settings_button");
let round = document.getElementById("round_number");
let clock = document.getElementById("clock");
let current_level = document.getElementById("current_level");
let next_level = document.getElementById("next_level");
let start_button = document.getElementById("start_button");
let bool = false; //tracks whether the clock is paused or not

// SETTINGS MENU VARIABLES
let settings_menu = document.getElementById("settings_menu");
let small = document.getElementsByClassName("small_blind");
let big = document.getElementsByClassName("big_blind");
let duration = document.getElementsByClassName("time");
let aux = []; // auxiliary variable used to calculate timer values
let rounds_counter = 0;

// DEFAULT SETTINGS MENU INITIAL VALUES
for (let index = 0; index < duration.length; index++) {
  duration[index].value = 15;
  aux[index] = duration[index].value * 60;
}
settings_menu.style.display = "none";

// DEFAULT MAIN CONTENT INITIAL VALUES
round.innerHTML = "Round " + (rounds_counter + 1);
clock.innerHTML = parseInt(duration[0].value) + ":00";
current_level.innerHTML =
  small[rounds_counter].value + "/" + big[rounds_counter].value;
next_level.innerHTML =
  small[rounds_counter + 1].value + "/" + big[rounds_counter + 1].value;

// MAIN MENU FUNCTIONS
function start_stop() {
  if (!bool) {
    interval = setInterval(update_timer, 1000);
    start_button.innerHTML = "Stop";
    bool = true;
  } else {
    clearInterval(interval);
    start_button.innerHTML = "Start";
    bool = false;
  }
}
function update_timer() {
  if (aux[rounds_counter] == 0) {
    let snd = new Audio("blindsup.mp3");
    snd.play();
    update_blinds();
  }

  let minutes = parseInt(aux[rounds_counter] / 60, 10);
  let seconds = parseInt(aux[rounds_counter] % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  clock.innerHTML = minutes + ":" + seconds;
  aux[rounds_counter]--;
}
function update_blinds() {
  rounds_counter++;
  current_level.innerHTML =
    small[rounds_counter].value + "/" + big[rounds_counter].value;
  round.innerHTML = "Round " + (rounds_counter + 1);
}

// SETTINGS MENU FUNCTIONS
function display_menu() {
  if (settings_menu.style.display == "none") {
    main.style.display = "none";
    settings_menu.style.display = "grid";
  } else {
    settings_menu.style.display = "none";
    main.style.display = "block";
  }
}

// MAIN MENU EVENT HANDLERS
start_button.onclick = start_stop;
settings_button.onclick = display_menu;

// SETTINGS MENU EVENT HANDLERS
for (let index = 0; index < aux.length; index++) {
  duration[index].onchange = function () {
    aux[index] = this.value * 60;
    if (rounds_counter == index) {
      update_timer();
    }
  };
}
for (let index = 0; index < small.length; index++) {
  small[index].onchange = function () {
    small[index].value = this.value;
    if (rounds_counter == index) {
      current_level.innerHTML = small[index].value + "/" + big[index].value;
    }
    if (rounds_counter + 1 == index) {
      next_level.innerHTML = small[index + 1].value + "/" + big[index].value;
    }
  };
}
for (let index = 0; index < big.length; index++) {
  big[index].onchange = function () {
    big[index].value = this.value;
    if (rounds_counter == index) {
      current_level.innerHTML = small[index].value + "/" + big[index].value;
    }
    if (rounds_counter + 1 == index) {
      next_level.innerHTML = small[index + 1].value + "/" + big[index].value;
    }
  };
}
