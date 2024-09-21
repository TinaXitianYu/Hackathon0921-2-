let interval;

console.log("Background script is running.");

// Function to start periodic checking
function startRegistrationCheck() {
    console.log("Starting periodic check for registration page.");
    
    interval = setInterval(() => {
        console.log("Checking for tabs with URL: https://acadinfo.wustl.edu/*");
        
        chrome.tabs.query({ url: "https://acadinfo.wustl.edu/*" }, function (tabs) {
            if (tabs.length > 0) {
                console.log(`Found ${tabs.length} tab(s) matching the URL.`);
                console.log(`Running content script on tab with ID: ${tabs[0].id}`);
                
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function() {
                        const registrationWorksheet = document.querySelectorAll('td.labelColumn');
                        console.log(`Found ${registrationWorksheet.length} 'td.labelColumn' elements on the page.`);
                        let found = false;
                        registrationWorksheet.forEach((element) => {
                            console.log(`Checking element text: ${element.textContent}`);
                            if (element.textContent.includes('Registration Worksheet')) {
                                found = true;
                                console.log("'Registration Worksheet' found!");
                            }
                        });
                        return found; // Return whether it was found
                    }
                }, (results) => {
                    console.log(`Script result: ${results ? results[0].result : 'No results returned'}`);
                    if (results && results[0].result === true) {
                        // If registration page is loaded, stop the interval and start registration
                        console.log("Registration page loaded, stopping periodic check and injecting content script.");
                        clearInterval(interval); // Stops reloads
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['contentScript.js']
                        });
                    } else {
                        // Reload the Webstac registration page to keep checking
                        console.log("Registration page not loaded, reloading tab.");
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            } else {
                console.log("No tabs found with the target URL.");
            }
        });
    }, 1000);  // Check every second (you can adjust the interval)
}

// Function to stop the periodic checking
function stopRegistrationCheck() {
    console.log("Stopping periodic registration check.");
    clearInterval(interval);
}

// Function to determine if the registration page has loaded
function checkIfRegistrationPageLoaded() {
    const registrationWorksheet = document.querySelectorAll('td.labelColumn');
    console.log(`Found ${registrationWorksheet.length} 'td.labelColumn' elements.`);
    let found = false;
    registrationWorksheet.forEach((element) => {
        console.log(`Checking element text: ${element.textContent}`);
        if (element.textContent.includes('Registration Worksheet')) {
            console.log("'Registration Worksheet' found, stopping check.");
            stopRegistrationCheck();
            found = true;
        }
    });
    return found; // Return whether it was found
}

// Open the registration page and start checking
function openRegistrationPage() {
    console.log("Opening the registration page.");
    chrome.tabs.update({ url: "https://acadinfo.wustl.edu/apps/Registration/" }, () => {
        console.log("Registration page opened, starting periodic check.");
        startRegistrationCheck(); // Start checking after opening the page
    });
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(`Received message: ${request.action}`);
    
    if (request.action === "startBackgroundProcess") {
        console.log("Background process triggered!");
        openRegistrationPage(); // Start the checking process
        sendResponse({status: "Process started"});
    }
});
