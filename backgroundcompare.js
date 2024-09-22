let interval;

console.log("Background script is running.");

let courseList = []; // Initialize with an empty course list

// Function to initialize the course list and save it in chrome.storage
function initializeCourseList() {
    // Start with an empty list
    courseList = [];

    // Save the empty list in chrome.storage
    chrome.storage.local.set({ courseList: courseList }, function() {
        console.log('Initialized with an empty course list.');
    });
}

// Function to add courses to the list (can be called as needed)
function addCourseToList(course) {
    courseList.push(course); // Add course to the list
    chrome.storage.local.set({ courseList: courseList }, function() {
        console.log('Course added to the list and saved in chrome.storage.');
    });
}

// Example: Adding a new course (call this function as needed)
function addSampleCourse() {
    const newCourse = { dept: 'E37', schcode: 'E', crs: '202', section: '01', registered: false };
    addCourseToList(newCourse);
}

// Function to start periodic checking
function startRegistrationCheck() {
    console.log("Starting periodic check for registration page.");
    
    interval = setInterval(() => {
        console.log("Checking for tabs with URL: https://acadinfo.wustl.edu/*");
        
        chrome.tabs.query({ url: "https://acadinfo.wustl.edu/*" }, function (tabs) {
            if (tabs.length > 0) {
                console.log(`Found ${tabs.length} tab(s) matching the URL.`);
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function() {
                        const registrationWorksheet = document.querySelectorAll('td.labelColumn');
                        let found = false;
                        registrationWorksheet.forEach((element) => {
                            if (element.textContent.includes('Registration Worksheet')) {
                                found = true;
                            }
                        });
                        return found;
                    }
                }, (results) => {
                    if (results && results[0].result === true) {
                        clearInterval(interval); // Stop the periodic check
                        // Inject contentScript.js with course list
                        chrome.storage.local.get('courseList', function(data) {
                            if (data.courseList) {
                                chrome.scripting.executeScript({
                                    target: { tabId: tabs[0].id },
                                    func: function(courses) {
                                        localStorage.setItem('courses', JSON.stringify(courses)); // Store in localStorage
                                    },
                                    args: [data.courseList]
                                });
                            }
                        });
                    } else {
                        chrome.tabs.reload(tabs[0].id); // Reload the tab
                    }
                });
            }
        });
    }, 1000);  // Check every second
}

// Start background process (triggered from popup or action)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startBackgroundProcess") {
        openRegistrationPage(); // Open and check registration page
        sendResponse({ status: "Process started" });
    }
});

// Open the registration page and start checking
function openRegistrationPage() {
    chrome.tabs.update({ url: "https://acadinfo.wustl.edu/apps/Registration/" }, startRegistrationCheck);
}

// Initialize empty course list on load
initializeCourseList();
