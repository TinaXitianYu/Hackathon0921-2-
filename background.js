let interval;
console.log("Background.js start")
// Function to start periodic checking
function startRegistrationCheck() {
    console.log("Start checking for acadingo.wustl")
    interval = setInterval(() => {
        chrome.tabs.query({ url: "https://acadinfo.wustl.edu/*" }, function (tabs) {
            if (tabs.length > 0) {
                console.log("Found matching tab")
                console.log("Looking for Registration worksheet")
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: checkIfRegistrationPageLoaded // Check if registration page can be loaded
                }, (results) => {
                    if (results && results[0].result === true) {
                        // If registration page is loaded, stop the interval and start registration
                        console.log("Found Registration worksheet, stop refreshing")
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
    }, 5000);  // Check every 5 seconds (you can adjust the interval)
}

// Function to stop the periodic checking
function stopRegistrationCheck() {
    clearInterval(interval);
}

// Function to determine if the registration page has loaded
function checkIfRegistrationPageLoaded() {
    // Check if the "Registration Worksheet" text is present on the page
    const registrationWorksheet = document.querySelectorAll('td.labelColumn');
    let found = false;
    registrationWorksheet.forEach((element) => {
        if (element.textContent.includes('Registration Worksheet')){
            console.log("Found Registration worksheet!")
            stopRegistrationCheck();
            found = true
        }
    });
    return found;
}

function openRegistrationPage() {
    chrome.tabs.update({ url: "https://acadinfo.wustl.edu/apps/Registration/" }, () => {
        startRegistrationCheck(); // Start checking after opening the page
    });
}
// Listen for messages from the popup.js
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === 'start') {
//         openRegistrationPage();
//         sendResponse({status: 'started'});
//     } else if (message.action === 'stop') {
//         stopRegistrationCheck();
//         sendResponse({status: 'stopped'});
//     }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startBackgroundProcess") {
        openRegistrationPage(); // Start the checking process
        sendResponse({status: "Process started"});
    // } else if (request.action === 'start') {
    //     console.log("Starting registration page check.");
    //     openRegistrationPage();
    //     sendResponse({status: 'started'});
    } else if (request.action === 'stop') {
        // console.log("Stopping registration page check.");
        stopRegistrationCheck();
        sendResponse({status: 'stopped'});
    }
});