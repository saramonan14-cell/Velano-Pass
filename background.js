/**
 * BACKGROUND SERVICE WORKER
 * Handles message passing between the Content Script (Netflix.com) and the Popup (Velano App).
 */

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  // 1. Content script asks: "Do we have a password for this site?"
  if (request.type === 'CHECK_LOGIN') {
    chrome.storage.local.get(['velano_vault', 'velano_status'], (result) => {
      // Note: In a real production app, decryption would happen in a WebWorker 
      // or we would match domains against hashed URLs to avoid exposing data.
      // Here we simulate the logic.
      
      const isLocked = !result.velano_status || result.velano_status === 'locked';
      if (isLocked) {
        sendResponse({ status: 'LOCKED' });
        return;
      }

      // If unlocked, we would search (simulated logic as we can't decrypt here without the key in memory)
      // In a full implementation, the key is cached in the background memory.
      sendResponse({ status: 'NO_MATCH' }); 
    });
    return true; // Keep channel open for async response
  }

  // 2. User submitted a form: "Please save these credentials!"
  if (request.type === 'PROPOSE_SAVE') {
    // Save the pending data to storage so when the user opens the popup, it's ready
    chrome.storage.local.set({ 
      'pending_save': {
        url: sender.tab.url,
        username: request.data.username,
        password: request.data.password,
        timestamp: Date.now()
      }
    }, () => {
      // Notify user (Badge or Notification)
      chrome.action.setBadgeText({ text: 'SAVE', tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9', tabId: sender.tab.id });
      
      // Optional: Open the popup automatically (subject to browser restrictions)
      // chrome.action.openPopup(); 
    });
  }

  // 3. Open the extension popup from the page
  if (request.type === 'OPEN_POPUP') {
     // Not directly possible in all browsers, usually requires user action.
     // We signal the badge instead.
     chrome.action.setBadgeText({ text: '!', tabId: sender.tab.id });
  }
});
