document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#tournament_form');
  const createTournamentBtn = document.querySelector('#create_tournament');
  const loadTournamentBtn = document.querySelector('#load_tournament');
  const addLevelBtn = document.querySelector('#add_level');
  const saveTournamentBtn = document.querySelector('#save_tournament');
  const updateTournamentBtn = document.querySelector('#update_tournament');
  const deleteTournamentBtn = document.querySelector('#delete_tournament');

  createTournamentBtn.addEventListener('click', () => {
    clearForm();
    form.classList.remove('hidden');
    saveTournamentBtn.classList.remove('hidden');
    updateTournamentBtn.classList.add('hidden');
    deleteTournamentBtn.classList.add('hidden');
    saveTournamentBtn.disabled = false;
    updateTournamentBtn.disabled = true;
    deleteTournamentBtn.disabled = true;
  });

  loadTournamentBtn.addEventListener('click', () => {
    clearForm();
    const tournamentId = prompt("Enter the ID of the tournament:");
    if (!tournamentId) {
      alert("Tournament ID is required");
      return;
    }
    fetch(`/tournament/${tournamentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        window.location.href = `/tournament/${tournamentId}`; // Redirect to the getTournamentById route
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error loading tournament');
      });
  });

  addLevelBtn.addEventListener('click', () => {
    addLevel();
  });

  saveTournamentBtn.addEventListener('click', (event) => {
    saveTournament();
  });

  updateTournamentBtn.addEventListener('click', (event) => {
    updateTournament();
  });

  deleteTournamentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    deleteTournament();
  });

  const saveTournament = () => {
    const levels = collectLevels();

    const formData = {
      buyin_money: form.querySelector('#buyin_money').value,
      buyin_chips: form.querySelector('#buyin_chips').value,
      rebuy_money: form.querySelector('#rebuy_money').value,
      rebuy_chips: form.querySelector('#rebuy_chips').value,
      addon_money: form.querySelector('#addon_money').value,
      addon_chips: form.querySelector('#addon_chips').value,
      levels
    };

    fetch('/save-tournament', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert('Tournament saved successfully')
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error saving tournament');
      });
  };

  const updateTournament = () => {
    const levels = collectLevels();

    const formData = {
      buyin_money: form.querySelector('#buyin_money').value,
      buyin_chips: form.querySelector('#buyin_chips').value,
      rebuy_money: form.querySelector('#rebuy_money').value,
      rebuy_chips: form.querySelector('#rebuy_chips').value,
      addon_money: form.querySelector('#addon_money').value,
      addon_chips: form.querySelector('#addon_chips').value,
      levels
    };

    fetch(`/update-tournament`, {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert('Tournament updated successfully')
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating tournament');
      });
  };

  const deleteTournament = () => {
    if (confirm('Are you sure you want to delete this tournament?')) {

      fetch('/delete-tournament', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .catch(error => {
          console.error('Error:', error);
          alert('Error deleting tournament');
        });
    }
  };

  const collectLevels = () => {
    const levels = [];
    document.querySelectorAll('#blind_structure > tbody > .level').forEach(tr => {
      const duration = tr.querySelector('.time').value;
      const small_blind = tr.querySelector('.small_blind').value;
      const big_blind = tr.querySelector('.big_blind').value;
      levels.push({ duration, small_blind, big_blind });
    });
    return levels;
  };

  const clearForm = () => {
    form.querySelector('#buyin_money').value = '';
    form.querySelector('#buyin_chips').value = '';
    form.querySelector('#rebuy_money').value = '';
    form.querySelector('#rebuy_chips').value = '';
    form.querySelector('#addon_money').value = '';
    form.querySelector('#addon_chips').value = '';

    document.querySelectorAll('#blind_structure > tbody > .level').forEach(tr => tr.remove());
  };

  const addLevel = () => {
    const index = document.querySelectorAll('#blind_structure > tbody > .level').length + 1;
    const newLevel = document.createElement('tr');
    newLevel.classList.add('level');
    newLevel.setAttribute('data-index', index);
    newLevel.innerHTML = `
      <td>Level ${index}</td>
      <td><input type="number" name="levels[${index}][duration]" class="form-input time" required></td>
      <td><input type="number" step="25" name="levels[${index}][small_blind]" class="form-input small_blind" required></td>
      <td><input type="number" step="25" name="levels[${index}][big_blind]" class="form-input big_blind" required></td>
    `;
    document.querySelector('#blind_structure > tbody').appendChild(newLevel);
  };
});
