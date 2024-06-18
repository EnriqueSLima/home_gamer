// Get the active tournament ID from the server (assuming you have a way to get it)
//const activeTournamentId = {{ activeTournamentId }};

// Get the form elements
const searchPlayerInput = document.getElementById('search_player_name');
const searchPlayerButton = document.getElementById('search_player_button');
const addPlayerButton = document.getElementById('add_player_button');
const rebuyInput = document.getElementById('rebuy');
const addonCheckbox = document.getElementById('addon');

// Search player functionality
searchPlayerButton.addEventListener('click', async () => {
  const playerName = searchPlayerInput.value.trim();
  console.log('Player name:', playerName); // Add this line
  if (playerName) {
    try {
      const response = await fetch(`/search-player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });
      //...
    } catch (error) {
      console.error(error);
    }
  }
});

// Add player functionality
addPlayerButton.addEventListener('click', async () => {
  const playerId = parseInt(document.querySelector('#search_results p:selected').dataset.playerId, 10);
  const rebuy = parseInt(rebuyInput.value, 10);
  const addon = addonCheckbox.checked;

  if (playerId && activeTournamentId) {
    try {
      const response = await fetch(`/api/tournaments/${activeTournamentId}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, rebuy, addon }),
      });
      const result = await response.json();
      if (result.success) {
        // Update the player structure menu
        updatePlayerStructureMenu();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

// Update the player structure menu
function updatePlayerStructureMenu() {
  // Make an AJAX request to get the updated player list for the active tournament
  fetch(`/api/tournaments/${activeTournamentId}/players`)
    .then(response => response.json())
    .then(players => {
      const playersInHtml = players.filter(player => player.inTournament).map(player => `<p>${player.name}</p>`).join('');
      const playersOutHtml = players.filter(player => !player.inTournament).map(player => `<p>${player.name}</p>`).join('');
      document.getElementById('players_in').innerHTML = playersInHtml;
      document.getElementById('players_out').innerHTML = playersOutHtml;
    })
    .catch(error => console.error(error));
}
