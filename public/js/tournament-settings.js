document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

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

    fetch('/tournament-settings', {
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
