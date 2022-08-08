// MAIN CONTENT VARIABLES
let settings_button = document.getElementById("settings_button");
let round = document.getElementById("round_number");
let clock = document.getElementById("clock");
let current_level = document.getElementById("current_level");
let next_level = document.getElementById("next_level");
let start_button = document.getElementById("start_button");
let player_display = document.getElementById("player_display");
let display_player_menu_button = document.getElementById(
  "display_player_menu_button"
);
let add_player_menu = document.getElementById("add_player_menu");
let general_display = document.getElementsByClassName("general_display");

// SETTINGS MENU VARIABLES
let settings_menu = document.getElementById("settings_menu");
let small = document.getElementsByClassName("small_blind");
let big = document.getElementsByClassName("big_blind");
let duration = document.getElementsByClassName("time");
let buyin_money = document.getElementById("buyin_money");
let buyin_chips = document.getElementById("buyin_chips");
let rebuy_money = document.getElementById("rebuy_money");
let rebuy_chips = document.getElementById("rebuy_chips");
let addon_money = document.getElementById("addon_money");
let addon_chips = document.getElementById("addon_chips");

// ADD PLAYER MENU VARIABLES
let close_add_player_button = document.getElementsByClassName("right")[0];

// COUNTERS AND AUXILIARY VARIABLES
let bool = false; //tracks whether the clock is paused or not
let aux = []; // auxiliary variable used to calculate timer values
let rounds_counter = 0;
let player_count = 0;
let players_left = 0;

// PLAYER CONSTRUCTOR
class Player {
  constructor(player_name, buyin, rebuy, addon, eliminated) {
    this.player_name = player_name;
    this.buyin = false;
    this.rebuy = rebuy;
    this.addon = false;
    this.eliminated = false;
  }
}

// DEFAULT SETTINGS MENU INITIAL VALUES
for (let index = 0; index < duration.length; index++) {
  aux[index] = duration[index].value * 60;
}
settings_menu.style.display = "none";
add_player_menu.style.display = "none";

// DEFAULT MAIN CONTENT INITIAL VALUES
round.innerHTML = "Round " + (rounds_counter + 1);
clock.innerHTML = duration[0].value + ":00";
current_level.innerHTML =
  small[rounds_counter].value + " / " + big[rounds_counter].value;
next_level.innerHTML =
  small[rounds_counter + 1].value + " / " + big[rounds_counter + 1].value;
general_display[0].innerHTML = "Buy ins ";
general_display[1].innerHTML = "Rebuys ";
general_display[2].innerHTML = "Add ons ";

// DEFAULT ADD PLAYER MENU INITIAL VALUES

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
  if (aux[rounds_counter] === 0) {
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
  round.innerHTML = "Round " + (rounds_counter + 1);
  current_level.innerHTML =
    small[rounds_counter].value + " / " + big[rounds_counter].value;
  next_level.innerHTML =
    small[rounds_counter + 1].value + " / " + big[rounds_counter + 1].value;
}

// SETTINGS MENU FUNCTIONS
function display_settings_menu() {
  if (settings_menu.style.display == "none") {
    main.style.display = "none";
    settings_menu.style.display = "block";
  } else {
    settings_menu.style.display = "none";
    main.style.display = "grid";
  }
}

// ADD PLAYER MENU FUNCTIONS
function display_player_menu() {
  let player_name = document.getElementById("player_name").value;
  let buyin = document.getElementById("buyin");
  let rebuy = document.getElementById("rebuy").value;
  let addon = document.getElementById("addon");
  let add_player_button2 = document.getElementById("add_player_button2");
  add_player_menu.style.display = "block";
}
function add_player() {
  let players = [];
  if (buyin.checked) {
    players[player_count] = new Player(player_name, buyin, rebuy, addon);
    players[player_count].buyin = true;
    if (addon.checked) {
      players[player_count].addon = true;
    }

    let create_player = document.createElement("div");
    let players_in = document.getElementById("players_in");
    let eliminate_player_button = document.createElement("button");
    let remove_player_button = document.createElement("button");
    eliminate_player_button.id = "eliminate_player";
    eliminate_player_button.title = "Eliminate player";
    remove_player_button.id = "remove_player_button";
    remove_player_button.title = "Remove player";
    eliminate_player_button.innerHTML = "&#45;"; // hyphen entity
    remove_player_button.innerHTML = "&times;";
    eliminate_player_button.addEventListener("click", eliminate_player);
    remove_player_button.addEventListener("click", remove_player);

    create_player.innerHTML =
      players[player_count].player_name.value +
      " " +
      players[player_count].rebuy.value +
      " " +
      players[player_count].addon +
      " ";
    players_in.appendChild(create_player).appendChild(eliminate_player_button);
    create_player.appendChild(remove_player_button);

    player_count++;
    players_left++;
    player_display.innerHTML = players_left + " / " + player_count;
  }
  add_player_menu.style.display = "none";
}
function eliminate_player() {
  let players_out = document.getElementById("players_out");
  let add_back_player = document.createElement("button");
  let node = this.parentNode.cloneNode(true);

  add_back_player.innerHTML = "&plus;";
  add_back_player.title = "Add back player";
  node.childNodes[1].remove();
  node.insertBefore(add_back_player, node.childNodes[1]);

  add_back_player.onclick = function () {
    let node1 = this.parentNode.cloneNode(true);
    let eliminate_player_button1 = document.createElement("button");
    eliminate_player_button1.innerHTML = "&#45;";
    eliminate_player_button1.title = "Eliminate player";
    eliminate_player_button1.addEventListener("click", eliminate_player);

    this.parentNode.remove();
    node1.childNodes[1].remove();
    node1.insertBefore(eliminate_player_button1, node1.childNodes[1]);
    node1.childNodes[2].onclick = remove_player;
    players_in.appendChild(node1);
    players_left++;
    player_display.innerHTML = players_left + " / " + player_count;
  };
  node.childNodes[2].onclick = remove_player;

  players_out.appendChild(node);
  this.parentNode.remove();
  players_left--;
  player_display.innerHTML = players_left + " / " + player_count;
}
function remove_player() {
  if (this.parentNode.parentNode.id === "players_out") {
    player_count--;
  } else {
    players_left--;
    player_count--;
  }
  this.parentNode.remove();
  player_display.innerHTML = players_left + " / " + player_count;
}
function close_add_player_menu() {
  add_player_menu.style.display = "none";
}
// MAIN MENU EVENT HANDLERS
start_button.onclick = start_stop;
settings_button.onclick = display_settings_menu;
display_player_menu_button.onclick = display_player_menu;

// SETTINGS MENU EVENT HANDLERS
for (let index = 0; index < aux.length; index++) {
  duration[index].onchange = function () {
    aux[index] = this.value * 60;
    rounds_counter == index ? update_timer() : "";
  };
}
for (let index = 0; index < small.length; index++) {
  small[index].onchange = function () {
    small[index].value = this.value;
    if (rounds_counter == index) {
      current_level.innerHTML = small[index].value + " / " + big[index].value;
    }
    if (rounds_counter + 1 == index) {
      next_level.innerHTML = small[index].value + " / " + big[index].value;
    }
  };
}
for (let index = 0; index < big.length; index++) {
  big[index].onchange = function () {
    big[index].value = this.value;
    if (rounds_counter == index) {
      current_level.innerHTML = small[index].value + " / " + big[index].value;
    }
    if (rounds_counter + 1 == index) {
      next_level.innerHTML = small[index].value + " / " + big[index].value;
    }
  };
}

// ADD PLAYER MENU EVENT HANDLERS
add_player_button2.onclick = add_player;
close_add_player_button.onclick = close_add_player_menu;
