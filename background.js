// background.js

// Store session data when the extension is closed
window.addEventListener('beforeunload', function(event) {
    chrome.storage.local.set({ key: value }, function() {
      console.log('Session data stored');
    });
  });
  
  // Retrieve session data when the extension is loaded
  chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(['key'], function(result) {
      console.log('Session data retrieved:', result.key);
      // Perform necessary actions based on the retrieved data
    });
  });
  