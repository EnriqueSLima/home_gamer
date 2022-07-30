let bool = false; //tracks whether the clock is paused or not
let button = document.getElementById("start_button");
let clock = document.getElementsByClassName("clock")[0];
let small = document.getElementsByClassName("small_blind");
let big = document.getElementsByClassName("big_blind");
let blinds = document.getElementsByClassName("levels")[0];
let duration = document.getElementsByClassName("time");
let dura_aux = [];
let rounds_counter = 0;

blinds.innerHTML =
  small[rounds_counter].value + "/" + big[rounds_counter].value;

  // DEFAULT INITIAL VALUES
for (let index = 0; index < duration.length; index++) {
  duration[index].value = 15;
  dura_aux[index] = duration[index].value * 60;
}

clock.innerHTML = parseInt(duration[0].value) + ":00";

function update_blinds() {
  rounds_counter++;
  blinds.innerHTML =
    small[rounds_counter].value + "/" + big[rounds_counter].value;
}

function update_timer() {
  if (dura_aux[rounds_counter] == 0) {
    let snd = new Audio("blindsup.mp3");
    snd.play();
    update_blinds();
  }

  let minutes = parseInt(dura_aux[rounds_counter] / 60, 10);
  let seconds = parseInt(dura_aux[rounds_counter] % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  clock.innerHTML = minutes + ":" + seconds;
  dura_aux[rounds_counter]--;
}
function start_stop() {
  if (!bool) {
    interval = setInterval(update_timer, 1000);
    button.innerHTML = "Stop";
    bool = true;
  } else {
    clearInterval(interval);
    button.innerHTML = "Start";
    bool = false;
  }
}
button.onclick = start_stop;

// SETTINGS MENU
let settings_button = document.getElementById("settings_button");
let settings_menu = document.getElementById("settings_menu");
// let main = document.getElementById("main");
// let field = document.getElementById("field_size");
// let buyin = document.getElementById("buyin_amount");

function display_menu() {
  if (settings_menu.style.display == "none") {
    main.style.display = "none";
    settings_menu.style.display = "grid";
  } else {
    settings_menu.style.display = "none";
    main.style.display = "block";
  }
}
settings_button.onclick = display_menu;

// Settings menu update
for (let index = 0; index < dura_aux.length; index++) {
    duration[index].onchange = function (){
        dura_aux[index] = this.value * 60;
    }
}
