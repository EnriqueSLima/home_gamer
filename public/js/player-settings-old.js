let players = [];
let player_count = 0;
let buyin_money;
let rebuy_money;
let addon_money;
let add_player_button = document.getElementById("add_player_button");
let players_left = 0;
let players_count = 0;

// Function to load and update players_left and players_count from sessionStorage
function loadPlayersCount() {
  const tournamentSettings = JSON.parse(sessionStorage.getItem('current_tournament_settings'));
  if (tournamentSettings) {
    players_left = tournamentSettings.playersLeft;
    players_count = tournamentSettings.playersCount;
  }
}

// Function to save updated players_left and players_count to sessionStorage
function savePlayersCount() {
  sessionStorage.setItem('current_tournament_settings', JSON.stringify({
    // other settings...
    playersLeft: players_left,
    playersCount: players_count
  }));
}

// When the page loads, load players count from sessionStorage
loadPlayersCount();

const fetchMoneySettings = new Promise((resolve, reject) => {
  document.addEventListener('DOMContentLoaded', function() {

    // Fetch the tournament duration from the server
    fetch('/tournament-structure')
      .then(response => response.text())
      .then(html => {
        // Create a temporary container element to parse the HTML
        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        buyin_money = tempContainer.querySelector('#buyin_money');
        rebuy_money = tempContainer.querySelector('#rebuy_money');
        addon_money = tempContainer.querySelector('#addon_money');
        resolve({ buyin_money, rebuy_money, addon_money });
      })
      .catch(error => {
        // Reject the promise if there's an error
        reject(error);
      });
  });
});

// PLAYER CONSTRUCTORS
class Player {
  constructor(player_name, buyin, rebuy, addon, total) {
    this.player_name = player_name;
    this.buyin = false;
    this.rebuy = rebuy;
    this.addon = false;
    this.total = function() {
      let player_total = 0;
      player_total =
        parseInt(buyin_money.value) + parseInt(rebuy_money.value) * this.rebuy;
      if (this.addon) {
        player_total += parseInt(addon_money.value);
      }
      return player_total;
    };
  }
}
class Player_display {
  constructor() {
    this.player_div = function() {
      let player_div = document.createElement("div");
      let name_span = document.createElement("span");
      let buyin_span = document.createElement("span");
      let rebuy_span = document.createElement("span");
      let addon_span = document.createElement("span");
      let total_span = document.createElement("span");
      let eliminate_player_button = document.createElement("button");
      let remove_player_button = document.createElement("button");

      eliminate_player_button.title = "Eliminate player";
      remove_player_button.title = "Remove player";
      eliminate_player_button.innerHTML = "&#45;"; // hyphen entity
      remove_player_button.innerHTML = "&times;";
      eliminate_player_button.addEventListener("click", eliminate_player);
      remove_player_button.addEventListener("click", remove_player);

      for (const x of players) {
        player_div.id = x.player_name;
        name_span.id = x.player_name;
        name_span.innerHTML = x.player_name;
        buyin_span.innerHTML = "R$ " + buyin_money.value;
        rebuy_span.innerHTML =
          "R$ " + parseInt(x.rebuy) * rebuy_money.value + " (" + x.rebuy + ")";
        addon_span.innerHTML = "R$ " + addon_money.value;
        if (!x.addon) {
          addon_span.innerHTML = "R$ 0";
        }
        total_span.innerHTML = "R$ " + x.total();
      }
      player_div.appendChild(name_span);
      player_div.appendChild(buyin_span);
      player_div.appendChild(rebuy_span);
      player_div.appendChild(addon_span);
      player_div.appendChild(total_span);
      player_div.appendChild(eliminate_player_button);
      player_div.appendChild(remove_player_button);
      return player_div;
    };
  }
}
// Function to update the player div
function updatePlayerDiv(player) {
  let players_in = document.getElementById("players_in");
  let player_display = new Player_display();

  player_display = player_display.player_div();
  players_in.appendChild(player_display);
}

// Function to add a player
function add_player() {
  let player_name = document.getElementById("player_name").value;
  let buyin = document.getElementById("buyin");
  let rebuy = document.getElementById("rebuy").value;
  let addon = document.getElementById("addon");
  let add_player_button2 = document.getElementById("add_player_button2");

  if (buyin.checked) {
    players.push(new Player(player_name, buyin, rebuy, addon));
    players_left++;
    players_count++;

    // Update player div
    updatePlayerDiv(players[players.length - 1]);

    // Save updated players count to sessionStorage
    savePlayersCount();
  }
}
//function add_player() {
//  let player_name = document.getElementById("player_name").value;
//  let buyin = document.getElementById("buyin");
//  let rebuy = document.getElementById("rebuy").value;
//  let addon = document.getElementById("addon");
//  let add_player_button2 = document.getElementById("add_player_button2");
//
//  if (buyin.checked) {
//    players.push(new Player(player_name, buyin, rebuy, addon));
//    players[player_count].buyin = true;
//    if (addon.checked) {
//      players[player_count].addon = true;
//    }
//
//    let players_in = document.getElementById("players_in");
//    let player_display = new Player_display();
//
//    player_display = player_display.player_div();
//    players_in.appendChild(player_display);
//
//    player_count++;
//    players_left++;
//    player_count_display.innerHTML = players_left + " / " + player_count;
//    update_chip_average_count();
//    update_pot_total();
//  }
//}

function eliminate_player() {
  let players_out = document.getElementById("players_out");
  let player_node = this.parentNode.cloneNode(true);
  player_node.childNodes[5].innerHTML = "&plus;";
  player_node.childNodes[5].title = "Add back player";

  player_node.childNodes[5].onclick = add_back_player;
  player_node.childNodes[6].remove();

  players_out.appendChild(player_node);
  this.parentNode.remove();
  players_left--;
  player_count_display.innerHTML = players_left + " / " + player_count;
  update_chip_average_count();
}
function add_back_player() {
  let elimination_node = this.parentNode.cloneNode(true);
  let remove_player_button = document.createElement("button");
  remove_player_button.innerHTML = "&times";

  elimination_node.childNodes[5].innerHTML = "&#45;";
  elimination_node.childNodes[5].title = "Eliminate player";
  elimination_node.appendChild(remove_player_button);

  this.childNodes.innerHTML = elimination_node;
  this.parentNode.remove();

  elimination_node.childNodes[5].onclick = eliminate_player;
  elimination_node.childNodes[6].onclick = remove_player;

  players_in.appendChild(elimination_node);
  players_left++;
  player_count_display.innerHTML = players_left + " / " + player_count;
  update_chip_average_count();
}

function remove_player() {
  let player_to_remove = this.parentNode.childNodes[0].id;

  for (let index = 0; index < players.length; index++) {
    if (players[index].player_name === player_to_remove)
      players.splice(index, 1);
  }

  player_count--;
  players_left--;
  this.parentNode.remove();
  player_count_display.innerHTML = players_left + " / " + player_count;
  update_chip_average_count();
  update_pot_total();
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
  let pot_total = document.getElementById("pot_total");
  let buyin_money = document.getElementById("buyin_money");
  let rebuy_money = document.getElementById("rebuy_money");
  let addon_money = document.getElementById("addon_money");
  let rebuy_calc = 0;
  let addon_calc = 0;

  for (let index = 0; index < players.length; index++) {
    rebuy_calc += parseInt(players[index].rebuy);
    if (players[index].addon) addon_calc++;
  }
  pot_total_calc =
    player_count * parseInt(buyin_money.value) +
    rebuy_calc * parseInt(rebuy_money.value) +
    addon_calc * parseInt(addon_money.value);

  pot_total.innerHTML = pot_total_calc;
  general_display[0].innerHTML = "Buy ins " + player_count;
  general_display[1].innerHTML = "Rebuys " + rebuy_calc;
  general_display[2].innerHTML = "Add ons " + addon_calc;

}
add_player_button.onclick = add_player;
