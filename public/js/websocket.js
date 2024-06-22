document.addEventListener('DOMContentLoaded', () => {
  let ws;

  function connectWebSocket() {
    ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`Received message: ${event.data}`);

      // Handle different actions
      if (data.action === 'start') {
        startClock();
      } else if (data.action === 'stop') {
        stopClock();
      } else if (data.action === 'update_value') {
        updateClockValue(data.newValue);
      } else {
        initializeClock(data);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 1000);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };
  }

  connectWebSocket();

  // Example functions to handle clock actions (you should implement these)
  function startClock() {
    console.log('Clock started');
    // Implement the logic to start the clock
  }

  function stopClock() {
    console.log('Clock stopped');
    // Implement the logic to stop the clock
  }

  function updateClockValue(newValue) {
    console.log(`Clock value updated to: ${newValue}`);
    // Implement the logic to update the clock value in the UI
    document.getElementById('clockValue').innerText = newValue;
  }

  function initializeClock(data) {
    console.log('Initializing clock with data:', data);
    // Initialize the clock with received data (blindsDuration, smallBlinds, bigBlinds, clockStatus, clockValue)
    document.getElementById('clockValue').innerText = data.clockValue;
    if (data.clockStatus) {
      startClock();
    } else {
      stopClock();
    }
  }
});
