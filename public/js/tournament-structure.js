document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#tournament_form');
  const createTournamentBtn = document.querySelector('#create_tournament');
  const loadTournamentBtn = document.querySelector('#load_tournament');
  const addLevelBtn = document.querySelector('#add_level');
  const saveTournamentBtn = document.querySelector('#save_tournament');
  const updateTournamentBtn = document.querySelector('#update_tournament');
  const deleteTournamentBtn = document.querySelector('#delete_tournament'); // Reference to delete button

  let currentTournamentId = null;

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
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        const tournament = data.tournament;
        const levels = data.levels;

        currentTournamentId = tournamentId;

        form.querySelector('#buyin_money').value = tournament.buyin_money;
        form.querySelector('#buyin_chips').value = tournament.buyin_chips;
        form.querySelector('#rebuy_money').value = tournament.rebuy_money;
        form.querySelector('#rebuy_chips').value = tournament.rebuy_chips;
        form.querySelector('#addon_money').value = tournament.addon_money;
        form.querySelector('#addon_chips').value = tournament.addon_chips;

        document.querySelectorAll('#blind_structure > tbody > .level').forEach(tr => tr.remove());

        levels.forEach((level, index) => {
          const newLevel = document.createElement('tr');
          newLevel.classList.add('level');
          newLevel.setAttribute('data-index', index + 1);
          newLevel.innerHTML = `
            <td>Level ${index + 1}</td>
            <td><input type="number" name="levels[${index + 1}][duration]" class="form-input time" value="${level.duration}" required></td>
            <td><input type="number" step="25" name="levels[${index + 1}][small_blind]" class="form-input small_blind" value="${level.small_blind}" required></td>
            <td><input type="number" step="25" name="levels[${index + 1}][big_blind]" class="form-input big_blind" value="${level.big_blind}" required></td>
          `;
          document.querySelector('#blind_structure > tbody').appendChild(newLevel);
        });

        form.classList.remove('hidden');
        saveTournamentBtn.classList.add('hidden');
        updateTournamentBtn.classList.remove('hidden');
        deleteTournamentBtn.classList.remove('hidden'); // Show delete button
        saveTournamentBtn.disabled = true;
        updateTournamentBtn.disabled = false;
        deleteTournamentBtn.disabled = false; // Enable delete button
      })
      .catch(error => {
        console.error('Error loading tournament:', error);
        alert('Error loading tournament');
      });
  });

  addLevelBtn.addEventListener('click', () => {
    addLevel();
  });

  saveTournamentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    saveTournament();
  });

  updateTournamentBtn.addEventListener('click', (event) => {
    event.preventDefault();
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
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Tournament saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error saving tournament');
      });
  };

  const updateTournament = () => {
    if (!currentTournamentId) {
      alert('No tournament loaded for updating');
      return;
    }

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

    fetch(`/update-tournament/${currentTournamentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Tournament updated successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating tournament');
      });
  };

  const deleteTournament = () => {
    if (!currentTournamentId) {
      alert('No tournament loaded for deletion');
      return;
    }

    if (confirm('Are you sure you want to delete this tournament?')) {
      fetch(`/delete-tournament/${currentTournamentId}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          alert('Tournament deleted successfully!');
          clearForm();
          form.classList.add('hidden');
          saveTournamentBtn.classList.add('hidden');
          updateTournamentBtn.classList.add('hidden');
          deleteTournamentBtn.classList.add('hidden');
          currentTournamentId = null;
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
