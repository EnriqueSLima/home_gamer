document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  const createButton = document.querySelector('#create_tournament');
  const loadButton = document.querySelector('#load_tournament');
  const addLevelButton = document.querySelector('#add_level');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const levels = [];
    document.querySelectorAll('#blind_structure > .level').forEach((div, index) => {
      const duration = div.querySelector('.time').value;
      const small_blind = div.querySelector('.small_blind').value;
      const big_blind = div.querySelector('.big_blind').value;
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

  const clearForm = () => {
    form.querySelector('#buyin_money').value = '';
    form.querySelector('#buyin_chips').value = '';
    form.querySelector('#rebuy_money').value = '';
    form.querySelector('#rebuy_chips').value = '';
    form.querySelector('#addon_money').value = '';
    form.querySelector('#addon_chips').value = '';

    document.querySelectorAll('#blind_structure > .level').forEach((div, index) => {
      if (index === 0) {
        div.querySelector('.time').value = '';
        div.querySelector('.small_blind').value = '';
        div.querySelector('.big_blind').value = '';
      } else {
        div.remove();
      }
    });
  };

  const addLevel = () => {
    const index = document.querySelectorAll('#blind_structure > .level').length + 1;
    const newLevel = document.createElement('div');
    newLevel.classList.add('level');
    newLevel.setAttribute('data-index', index);
    newLevel.innerHTML = `
      <label for="level${index}" class="form-label">Level ${index}</label>
      <input type="number" name="levels[${index}][duration]" class="form-input time" required>
      <input type="number" step="25" name="levels[${index}][small_blind]" class="form-input small_blind" required>
      <input type="number" step="25" name="levels[${index}][big_blind]" class="form-input big_blind" required>
    `;
    document.querySelector('#blind_structure').appendChild(newLevel);
  };

  createButton.addEventListener('click', () => {
    clearForm();
    form.classList.remove('hidden');
  });

  loadButton.addEventListener('click', () => {
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
        //form.querySelector('#tournament_id').value = tournament.id;
        form.querySelector('#buyin_money').value = tournament.buyin_money;
        form.querySelector('#buyin_chips').value = tournament.buyin_chips;
        form.querySelector('#rebuy_money').value = tournament.rebuy_money;
        form.querySelector('#rebuy_chips').value = tournament.rebuy_chips;
        form.querySelector('#addon_money').value = tournament.addon_money;
        form.querySelector('#addon_chips').value = tournament.addon_chips;

        // Clear existing levels
        document.querySelectorAll('#blind_structure > .level').forEach((div, index) => {
          if (index === 0) {
            div.remove();
          }
        });

        // Add levels
        levels.forEach((level, index) => {
          const newLevel = document.createElement('div');
          newLevel.classList.add('level');
          newLevel.setAttribute('data-index', index + 1);
          newLevel.innerHTML = `
            <label for="level${index + 1}" class="form-label">Level ${index + 1}</label>
            <input type="number" name="levels[${index + 1}][duration]" class="form-input time" value="${level.duration}" required>
            <input type="number" step="25" name="levels[${index + 1}][small_blind]" class="form-input small_blind" value="${level.small_blind}" required>
            <input type="number" step="25" name="levels[${index + 1}][big_blind]" class="form-input big_blind" value="${level.big_blind}" required>
          `;
          document.querySelector('#blind_structure').appendChild(newLevel);
        });

        form.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error loading tournament:', error);
        alert('Error loading tournament');
      });
  });

  addLevelButton.addEventListener('click', () => {
    addLevel();
  });
});
