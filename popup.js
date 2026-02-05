document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const speedSlider = document.getElementById('speed');
  const speedDisplay = document.getElementById('speedDisplay');
  const statusDiv = document.getElementById('status');
  
  let currentStatus = 'stopped';
  
  // Atualizar display da velocidade
  speedSlider.addEventListener('input', function() {
    speedDisplay.textContent = this.value + 'ms';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        speed: parseInt(speedSlider.value)
      });
    });
  });
  
  // Carregar configurações salvas
  chrome.storage.local.get(['formFillerSpeed', 'formFillerStatus'], function(result) {
    if (result.formFillerSpeed) {
      speedSlider.value = result.formFillerSpeed;
      speedDisplay.textContent = result.formFillerSpeed + 'ms';
    }
    if (result.formFillerStatus) {
      updateStatus(result.formFillerStatus);
    }
  });
  
  startBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'start',
        speed: parseInt(speedSlider.value)
      });
    });
    updateStatus('active');
  });
  
  pauseBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'pause'});
    });
    updateStatus('paused');
  });
  
  stopBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'stop'});
    });
    updateStatus('stopped');
  });
  
  function updateStatus(status) {
    currentStatus = status;
    chrome.storage.local.set({formFillerStatus: status});
    
    statusDiv.className = `status ${status}`;
    
    switch(status) {
      case 'active':
        statusDiv.textContent = 'Status: Ativo ✅';
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        break;
      case 'paused':
        statusDiv.textContent = 'Status: Pausado ⏸️';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = false;
        break;
      case 'stopped':
        statusDiv.textContent = 'Status: Parado ⏹️';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        break;
    }
    
    // Salvar velocidade
    chrome.storage.local.set({formFillerSpeed: parseInt(speedSlider.value)});
  }
});
