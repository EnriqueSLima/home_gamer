let players = [];
let player_count = 0;
let buyin_money;
let add_player_button = document.getElementById("add_player_button");


const fetchTournamentSettings = new Promise((resolve, reject) => {
  document.addEventListener('DOMContentLoaded', function() {

    // Fetch the tournament duration from the server
    fetch('/tournament-settings')
      .then(response => response.text())
      .then(html => {
        // Create a temporary container element to parse the HTML
        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        buyin_money = tempContainer.getElementById('buyin_money');
        resolve(buyin_money);
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

    let players_in = document.getElementById("players_in");
    let player_display = new Player_display();

    player_display = player_display.player_div();
    players_in.appendChild(player_display);

    player_count++;
    players_left++;
    player_count_display.innerHTML = players_left + " / " + player_count;
    update_chip_average_count();
    update_pot_total();
  }
}
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
add_player_button.onclick = add_player;
