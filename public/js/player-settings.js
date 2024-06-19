// Get the form elements
const searchPlayerInput = document.getElementById('search_player_name');
const searchPlayerButton = document.getElementById('search_player_button');
const registerButtons = document.querySelectorAll('.register_player_button');
const eliminateButtons = document.querySelectorAll('.eliminate_player_button');

// Create the modal element
const modal = document.createElement('div');
modal.classList.add('modal');

// Create the modal background
const modalBackground = document.createElement('div');
modalBackground.classList.add('modal-background');
modal.appendChild(modalBackground);

// Create the modal content
const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');
modal.appendChild(modalContent);

// Add the modal content
const rebuyLabel = document.createElement('label');
rebuyLabel.textContent = 'Rebuy:';
modalContent.appendChild(rebuyLabel);

const rebuyInput = document.createElement('input');
rebuyInput.type = 'number';
rebuyInput.value = 0;
modalContent.appendChild(rebuyInput);

const addonLabel = document.createElement('label');
addonLabel.textContent = 'Addon:';
modalContent.appendChild(addonLabel);

const addonCheckbox = document.createElement('input');
addonCheckbox.type = 'checkbox';
modalContent.appendChild(addonCheckbox);

const registerButton = document.createElement('button');
registerButton.textContent = 'Register';
modalContent.appendChild(registerButton);

// Add an event listener to the register button
registerButton.addEventListener('click', async () => {
  const playerId = modal.playerId;
  const rebuyValue = modal.rebuyValue;
  const addonValue = modal.addonValue;

  try {
    const response = await fetch('/register-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, rebuy: rebuyValue, addon: addonValue }),
    });
    const result = await response.json();
    alert(result.message);
    modal.remove(); // Remove the modal
  } catch (error) {
    console.error('Error:', error);
  }
});

// Add an event listener to the modal background to close the modal when clicked
modalBackground.addEventListener('click', () => {
  modal.remove(); // Remove the modal
});
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
    document.body.appendChild(modal); // Add the modal to the body
    modal.style.display = 'block'; // Show the modal

    // Set the playerId as a variable on the modal
    modal.playerId = playerId;
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
