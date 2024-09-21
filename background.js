let interval;

// Function to start periodic checking
function startRegistrationCheck() {
    interval = setInterval(() => {
        chrome.tabs.query({ url: "https://acadinfo.wustl.edu/*" }, function (tabs) {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: checkIfRegistrationPageLoaded // Check if registration page can be loaded
                }, (results) => {
                    if (results && results[0].result === true) {
                        // If registration page is loaded, stop the interval and start registration
                        clearInterval(interval); //stops reloads
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['contentScript.js']
                        });
                    } else {
                        // Reload the Webstac registration page to keep checking
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            }
        });
    }, 1000);  // Check every 5 seconds (you can adjust the interval)
}

// Function to stop the periodic checking
function stopRegistrationCheck() {
    clearInterval(interval);
}

// Function to determine if the registration page has loaded
function checkIfRegistrationPageLoaded() {
    // Check if the "Registration Worksheet" text is present on the page
    const registrationWorksheet = document.querySelector('td.labelColumn');
    return registrationWorksheet && registrationWorksheet.textContent.includes('Registration Worksheet');
}

// Listen for messages from the popup.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'start') {
        startRegistrationCheck();
        sendResponse({status: 'started'});
    } else if (message.action === 'stop') {
        stopRegistrationCheck();
        sendResponse({status: 'stopped'});
    }
});
