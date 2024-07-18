let countdown;
let endTime;
let duration;
let startTime;

function startCustomFast() {
  const days = parseInt(document.getElementById('customDays').value);
  if (days > 0) {
    startFast(days);
  } else {
    alert('Please enter a valid number of days.');
  }
}

function startFast(days) {
  duration = days * 24 * 60 * 60 * 1000;
  startTime = Date.now();
  endTime = startTime + duration;

  localStorage.setItem('fastStartTime', startTime);
  localStorage.setItem('fastEndTime', endTime);
  localStorage.setItem('fastDuration', duration);

  document.getElementById('durationButtons').classList.add('hidden');
  document.getElementById('stop').classList.remove('hidden');

  updateTimer();
  countdown = setInterval(updateTimer, 1000);
}

function stopFast() {
  clearInterval(countdown);
  const actualDuration = Date.now() - startTime;
  saveFastHistory(actualDuration);
  resetTimer();
}

function updateTimer() {
  const remaining = endTime - Date.now();
  if (remaining <= 0) {
    clearInterval(countdown);
    saveFastHistory(duration);
    resetTimer();
    alert('Fasting complete!');
  } else {
    updateTimerDisplay(remaining);
  }
}

function updateTimerDisplay(timeInMs) {
  const days = Math.floor(timeInMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeInMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeInMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeInMs % (60 * 1000)) / 1000);

  document.getElementById('timer').textContent =
    `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
  document.getElementById('timer').textContent = '00:00:00:00';
  document.getElementById('durationButtons').classList.remove('hidden');
  document.getElementById('stop').classList.add('hidden');
  localStorage.removeItem('fastStartTime');
  localStorage.removeItem('fastEndTime');
  localStorage.removeItem('fastDuration');
}

function saveFastHistory(actualDuration) {
  let history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  history.unshift({
    startDate: new Date(startTime).toLocaleString(),
    duration: formatDuration(actualDuration)
  });
  localStorage.setItem('fastHistory', JSON.stringify(history));
  updateHistoryDisplay();
}

function formatDuration(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${days} days, ${hours} hours, ${minutes} minutes`;
}

function updateHistoryDisplay() {
  const history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  history.forEach(fast => {
    const li = document.createElement('li');
    li.textContent = `Started: ${fast.startDate}, Duration: ${fast.duration}`;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  if (confirm('Are you sure you want to clear your fasting history?')) {
    localStorage.removeItem('fastHistory');
    updateHistoryDisplay();
  }
}

function openModal() {
  document.getElementById('scriptureModal').classList.add('modal-open');
}

function closeModal() {
  document.getElementById('scriptureModal').classList.remove('modal-open');
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById('scriptureModal')) {
    closeModal();
  }
}

// Check for ongoing fast on page load
window.onload = function () {
  const savedStartTime = localStorage.getItem('fastStartTime');
  const savedEndTime = localStorage.getItem('fastEndTime');
  const savedDuration = localStorage.getItem('fastDuration');

  if (savedStartTime && savedEndTime && savedDuration) {
    startTime = parseInt(savedStartTime);
    endTime = parseInt(savedEndTime);
    duration = parseInt(savedDuration);

    if (Date.now() < endTime) {
      document.getElementById('durationButtons').classList.add('hidden');
      document.getElementById('stop').classList.remove('hidden');
      updateTimer();
      countdown = setInterval(updateTimer, 1000);
    } else {
      saveFastHistory(duration);
      resetTimer();
    }
  }

  updateHistoryDisplay();
};
