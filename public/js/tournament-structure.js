document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const createTournamentBtn = document.querySelector('#create_tournament');
  const loadTournamentBtn = document.querySelector('#load_tournament');
  const addLevelBtn = document.querySelector('#add_level');
  const saveTournamentBtn = document.querySelector('#save_tournament');
  const updateTournamentBtn = document.querySelector('#update_tournament');

  // Event listener for Create tournament button
  createTournamentBtn.addEventListener('click', () => {
    clearForm();
    form.classList.remove('hidden');
    saveTournamentBtn.classList.remove('hidden');
    updateTournamentBtn.classList.add('hidden');
    saveTournamentBtn.disabled = false;
    updateTournamentBtn.disabled = true;
  });

  // Event listener for Load tournament button
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

        // Populate form with the loaded tournament data
        form.querySelector('#buyin_money').value = tournament.buyin_money;
        form.querySelector('#buyin_chips').value = tournament.buyin_chips;
        form.querySelector('#rebuy_money').value = tournament.rebuy_money;
        form.querySelector('#rebuy_chips').value = tournament.rebuy_chips;
        form.querySelector('#addon_money').value = tournament.addon_money;
        form.querySelector('#addon_chips').value = tournament.addon_chips;

        // Clear existing levels
        document.querySelectorAll('#blind_structure > tbody > .level').forEach(tr => tr.remove());

        // Add levels
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
        saveTournamentBtn.disabled = false;
        updateTournamentBtn.disabled = true;
      })
      .catch(error => {
        console.error('Error loading tournament:', error);
        alert('Error loading tournament');
      });
  });

  // Function to clear the form inputs
  const clearForm = () => {
    form.querySelector('#buyin_money').value = '';
    form.querySelector('#buyin_chips').value = '';
    form.querySelector('#rebuy_money').value = '';
    form.querySelector('#rebuy_chips').value = '';
    form.querySelector('#addon_money').value = '';
    form.querySelector('#addon_chips').value = '';

    document.querySelectorAll('#blind_structure > tbody > .level').forEach((tr, index) => {
      tr.remove();
    });
  };

  // Function to add a new level
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

  // Event listener for Add level button
  addLevelBtn.addEventListener('click', () => {
    addLevel();
  });

  // Event listener for form submission (Save tournament)
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const levels = [];
    document.querySelectorAll('#blind_structure > tbody > .level').forEach((tr, index) => {
      const duration = tr.querySelector('.time').value;
      const small_blind = tr.querySelector('.small_blind').value;
      const big_blind = tr.querySelector('.big_blind').value;
      levels.push({ duration, small_blind, big_blind });
    });

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
        alert('Settings saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});
