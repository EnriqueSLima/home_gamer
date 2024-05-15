let timerState = localStorage.getItem('timerState');
let remainingTime = timerState.remainingTime;

if (timerState) {
  setInterval(remainingTime--, 1000);
  console.log(remainingTime);
}
