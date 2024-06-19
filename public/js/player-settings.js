// Get the form elements
const searchPlayerInput = document.getElementById('search_player_name');
const searchPlayerButton = document.getElementById('search_player_button');
const rebuyInput = document.getElementById('rebuy');
const addonCheckbox = document.getElementById('addon');
const registerButtons = document.querySelectorAll('.register_player_button');
const eliminateButtons = document.querySelectorAll('.eliminate_player_button');

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
    } catch (error) {
      console.error(error);
    }
  }
});

registerButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const playerId = event.target.getAttribute('data-player-id');
    try {
      const response = await fetch('/register-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

eliminateButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const playerId = event.target.getAttribute('data-player-id');
    try {
      const response = await fetch('/eliminate-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      if (response.ok) {
        window.location.reload(); // Reload to update the player structure menu
      } else {
        console.error('Error eliminating player:', response.statusText);
      }
    } catch (error) {
      console.error('Error eliminating player:', error);
    }
  });
});
// Add player functionality
//addPlayerButton.addEventListener('click', async () => {
//  const playerId = parseInt(document.querySelector('#search_results p:selected').dataset.playerId, 10);
//  const rebuy = parseInt(rebuyInput.value, 10);
//  const addon = addonCheckbox.checked;
//
//  if (playerId && activeTournamentId) {
//    try {
//      const response = await fetch(`/api/tournaments/${activeTournamentId}/players`, {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({ playerId, rebuy, addon }),
//      });
//      const result = await response.json();
//      if (result.success) {
//        // Update the player structure menu
//        updatePlayerStructureMenu();
//      } else {
//        console.error(result.error);
//      }
//    } catch (error) {
//      console.error(error);
//    }
//  }
//});
//
//// Update the player structure menu
//function updatePlayerStructureMenu() {
//  // Make an AJAX request to get the updated player list for the active tournament
//  fetch(`/api/tournaments/${activeTournamentId}/players`)
//    .then(response => response.json())
//    .then(players => {
//      const playersInHtml = players.filter(player => player.inTournament).map(player => `<p>${player.name}</p>`).join('');
//      const playersOutHtml = players.filter(player => !player.inTournament).map(player => `<p>${player.name}</p>`).join('');
//      document.getElementById('players_in').innerHTML = playersInHtml;
//      document.getElementById('players_out').innerHTML = playersOutHtml;
//    })
//    .catch(error => console.error(error));
//}
