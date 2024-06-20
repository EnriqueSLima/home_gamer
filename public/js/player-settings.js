// Get the form elements
const searchPlayerInput = document.getElementById('search_player_name');
const searchPlayerButton = document.getElementById('search_player_button');
const registerButtons = document.querySelectorAll('.register_player_button');
const updateButtons = document.querySelectorAll('.update_player_button');
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
modalContent.appendChild(rebuyInput);

const addonLabel = document.createElement('label');
addonLabel.textContent = 'Addon:';
modalContent.appendChild(addonLabel);

const addonCheckbox = document.createElement('input');
addonCheckbox.type = 'checkbox';
modalContent.appendChild(addonCheckbox);

const modalButton = document.createElement('button');
modalContent.appendChild(modalButton);

// Add an event listener to the modal background to close the modal when clicked
modalBackground.addEventListener('click', () => {
  modal.remove(); // Remove the modal
});

// Add an event listener to the register and update buttons
function handleModalButtonClick(event, isRegister) {
  const playerId = event.target.getAttribute('data-player-id');
  document.body.appendChild(modal); // Add the modal to the body
  modal.style.display = 'block'; // Show the modal

  // Set the playerId as a variable on the modal
  modal.playerId = playerId;
  modalButton.textContent = isRegister ? 'Register' : 'Update';

  modalButton.addEventListener('click', async () => {
    const rebuyValue = rebuyInput.value;
    const addonValue = addonCheckbox.checked;

    const url = isRegister ? '/register-player' : '/update-player';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, rebuys: rebuyValue, addon: addonValue }),
      });
      const result = await response.json();
      alert(result.message);
      // Clear input fields after successful action
      rebuyInput.value = ''; // Clear rebuy input
      addonCheckbox.checked = false; // Uncheck addon checkbox
      modal.remove(); // Remove the modal
      if (result.success) {
        window.location.href = result.redirectUrl; // Redirect to player settings
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

registerButtons.forEach(button => {
  button.addEventListener('click', (event) => handleModalButtonClick(event, true));
});

updateButtons.forEach(button => {
  button.addEventListener('click', (event) => handleModalButtonClick(event, false));
});

eliminateButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const playerId = event.target.getAttribute('data-player-id');
    const confirmation = confirm('Are you sure you want to eliminate this player?');
    if (confirmation) {
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
    }
  });
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
