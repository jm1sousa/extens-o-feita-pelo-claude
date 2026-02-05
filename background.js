chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Form Filler extensão instalada');
  
  // Inicializar configurações padrão
  chrome.storage.local.set({
    formFillerStatus: 'stopped',
    formFillerSpeed: 1000
  });
});

// Listener para comunicação entre scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['formFillerStatus', 'formFillerSpeed'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});
