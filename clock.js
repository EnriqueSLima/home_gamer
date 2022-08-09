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

// ADD PLAYER MENU VARIABLES
let players = [];
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
function update_chip_average_count() {
  let buyin_chips = document.getElementById("buyin_chips");
  let rebuy_chips = document.getElementById("rebuy_chips");
  let addon_chips = document.getElementById("addon_chips");
  let rebuy_amount = 0;
  let addon_amount = 0;
  let average = document.getElementById("average");
  let chip_count = document.getElementById("chip_count");
  let average_calc = 0;
  let chip_count_calc = 0;

  for (let index = 0; index < player_count; index++) {
    rebuy_amount += parseInt(players[index].rebuy);
    if (players[index].addon === true) {
      addon_amount++;
    }
  }
  chip_count_calc =
    parseInt(buyin_chips.value * player_count) +
    parseInt(rebuy_chips.value * rebuy_amount) +
    parseInt(addon_chips.value * addon_amount);
  chip_count.innerHTML = chip_count_calc;
  average_calc = parseInt(chip_count_calc / players_left);

  isNaN(average_calc) ? (average_calc = 0) : "";
  average.innerHTML = average_calc;
}
function update_pot_total() {
  let buyin_money = document.getElementById("buyin_money");
  let rebuy_money = document.getElementById("rebuy_money");
  let addon_money = document.getElementById("addon_money");
  // NEEDS LOGIC
}

// SETTINGS MENU FUNCTIONS
function display_settings_menu() {
  if (settings_menu.style.display === "none") {
    main.style.display = "none";
    settings_menu.style.display = "block";
  } else {
    settings_menu.style.display = "none";
    main.style.display = "grid";
  }
}

// ADD PLAYER MENU FUNCTIONS
function display_add_player_menu() {
  add_player_menu.style.display = "block";
}
function add_player() {
  let player_name = document.getElementById("player_name").value;
  let buyin = document.getElementById("buyin");
  let rebuy = document.getElementById("rebuy").value;
  let addon = document.getElementById("addon");
  let add_player_button2 = document.getElementById("add_player_button2");

  if (buyin.checked) {
    players.push(new Player(player_name, buyin, rebuy, addon));
    players[player_count].buyin = true;
    if (addon.checked) {
      players[player_count].addon = true;
    }
    let create_player = document.createElement("div");
    let players_in = document.getElementById("players_in");
    let eliminate_player_button = document.createElement("button");
    let remove_player_button = document.createElement("button");

    eliminate_player_button.title = "Eliminate player";
    remove_player_button.title = "Remove player";
    eliminate_player_button.innerHTML = "&#45;"; // hyphen entity
    remove_player_button.innerHTML = "&times;";
    eliminate_player_button.addEventListener("click", eliminate_player);
    remove_player_button.addEventListener("click", remove_player);

    create_player.innerHTML =
      players[player_count].player_name +
      " " +
      players[player_count].rebuy +
      " " +
      players[player_count].addon +
      " ";
    players_in.appendChild(create_player).appendChild(eliminate_player_button);
    create_player.appendChild(remove_player_button);

    player_count++;
    players_left++;
    player_display.innerHTML = players_left + " / " + player_count;

    update_chip_average_count();
  }
  add_player_menu.style.display = "none";
}
function eliminate_player() {
  let players_out = document.getElementById("players_out");
  let player_node = this.parentNode.cloneNode(true);
  player_node.childNodes[1].innerHTML = "&plus;";
  player_node.childNodes[1].title = "Add back player";

  player_node.childNodes[1].onclick = add_back_player;
  player_node.childNodes[2].onclick = remove_player;

  players_out.appendChild(player_node);
  this.parentNode.remove();
  players_left--;
  player_display.innerHTML = players_left + " / " + player_count;
  update_chip_average_count();
}
function add_back_player() {
  let elimination_node = this.parentNode.cloneNode(true);

  elimination_node.childNodes[1].innerHTML = "&#45;";
  elimination_node.childNodes[1].title = "Eliminate player";

  this.childNodes.innerHTML = elimination_node;
  this.parentNode.remove();

  elimination_node.childNodes[1].onclick = eliminate_player;
  elimination_node.childNodes[2].onclick = remove_player;

  players_in.appendChild(elimination_node);
  players_left++;
  player_display.innerHTML = players_left + " / " + player_count;
  update_chip_average_count();
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
  update_chip_average_count();
}
function close_add_player_menu() {
  add_player_menu.style.display = "none";
}
// MAIN MENU EVENT HANDLERS
start_button.onclick = start_stop;
settings_button.onclick = display_settings_menu;
display_player_menu_button.onclick = display_add_player_menu;

// SETTINGS MENU EVENT HANDLERS
for (let index = 0; index < aux.length; index++) {
  duration[index].onchange = function () {
    aux[index] = this.value * 60;
    rounds_counter === index ? update_timer() : "";
  };
}
for (let index = 0; index < small.length; index++) {
  small[index].onchange = function () {
    small[index].value = this.value;
    if (rounds_counter === index) {
      current_level.innerHTML = small[index].value + " / " + big[index].value;
    }
    if (rounds_counter + 1 === index) {
      next_level.innerHTML = small[index].value + " / " + big[index].value;
    }
  };
}
for (let index = 0; index < big.length; index++) {
  big[index].onchange = function () {
    big[index].value = this.value;
    if (rounds_counter === index) {
      current_level.innerHTML = small[index].value + " / " + big[index].value;
    }
    if (rounds_counter + 1 === index) {
      next_level.innerHTML = small[index].value + " / " + big[index].value;
    }
  };
}

// ADD PLAYER MENU EVENT HANDLERS
add_player_button2.onclick = add_player;
close_add_player_button.onclick = close_add_player_menu;
