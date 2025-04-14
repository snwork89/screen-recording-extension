chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_CAPTURE") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
          chrome.desktopCapture.chooseDesktopMedia(
            ["screen", "window", "tab"],
            tab,
            (streamId) => {
              if (chrome.runtime.lastError) {
                console.error("Error choosing media:", chrome.runtime.lastError.message);
                sendResponse({ streamId: null, error: chrome.runtime.lastError.message });
              } else {
                sendResponse({ streamId });
              }
            }
          );
        } else {
          sendResponse({ streamId: null, error: "No active tab" });
        }
      });
  
      return true; // Keep message channel open
    }
  });
  