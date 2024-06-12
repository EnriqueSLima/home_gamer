document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const createButton = document.querySelector('#create_tournament');
  const addLevelButton = document.querySelector('#add_level');
  const blindStructure = document.querySelector('#blind_structure');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const levels = [];
    document.querySelectorAll('#blind_structure > div').forEach((div, index) => {
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
    blindStructure.appendChild(newLevel);
  };
  createButton.addEventListener('click', () => {
    clearForm();
    form.classList.remove('hidden');
  });

  addLevelButton.addEventListener('click', () => {
    addLevel();
  });
});

/*
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#tournament_form');
  const createButton = document.querySelector('#create_tournament');
  const loadButton = document.querySelector('#load_tournament');
  const updateButton = document.querySelector('#update_tournament');
  const addLevelButton = document.querySelector('#add_level');
  const blindStructure = document.querySelector('#blind_structure');

  const gatherFormData = () => {
    const levels = [];
    document.querySelectorAll('#blind_structure >.level').forEach((div, index) => {
      const duration = div.querySelector('.time').value;
      const small_blind = div.querySelector('.small_blind').value;
      const big_blind = div.querySelector('.big_blind').value;
      levels.push({ duration, small_blind, big_blind });
    });

    return {
      buyin_money: form.querySelector('#buyin_money').value,
      buyin_chips: form.querySelector('#buyin_chips').value,
      rebuy_money: form.querySelector('#rebuy_money').value,
      rebuy_chips: form.querySelector('#rebuy_chips').value,
      addon_money: form.querySelector('#addon_money').value,
      addon_chips: form.querySelector('#addon_chips').value,
      levels
    };
  };

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
    blindStructure.appendChild(newLevel);
  };

  createButton.addEventListener('click', () => {
    clearForm();
    form.classList.remove('hidden');
  });

  loadButton.addEventListener('click', () => {
    // Load tournament logic here
    alert('Load Tournament clicked');
  });

  updateButton.addEventListener('click', () => {
    const formData = gatherFormData();
    fetch('/update-tournament', {
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
      });
  });

  addLevelButton.addEventListener('click', () => {
    addLevel();
  });
})
*/;
