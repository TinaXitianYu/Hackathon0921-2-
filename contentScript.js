// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to get all courses from RWS1 using a traditional for loop
function getCoursesFromRWS1() {
    const courses = [];
    const rws1Tab = document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]');
    
    if (rws1Tab) {
        const addCourseLinks = rws1Tab.querySelectorAll('a.lnkAddCourse');
        
        // Using a for loop instead of forEach
        for (let i = 0; i < addCourseLinks.length; i++) {
            const link = addCourseLinks[i];
            const dept = link.getAttribute('dept');
            const schcode = link.getAttribute('schcode');
            const crs = link.getAttribute('crs');
            const section = link.getAttribute('sec');
            const courseId = `${dept} ${schcode} ${crs} ${section}`;
            
            courses.push({ courseId, dept, schcode, crs, section, link });
        }
    }
    return courses;
}

// Function to attempt adding all courses
function attemptCourses(courses) {
    for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        const course = courses[courseIndex];
        console.log(`Attempting to add course: ${course.courseId}`);

        // Store the current course index and courses in sessionStorage
        sessionStorage.setItem('currentCourseIndex', courseIndex);
        sessionStorage.setItem('courses', JSON.stringify(courses));

        try {
            // Click the "Add Course" link
            course.link.click();
            console.log(`Clicked on course: ${course.courseId}`);

            // After clicking, check for errors after a delay
            setTimeout(() => {
                if (checkForError()) {
                    console.log(`Error encountered when adding course: ${course.courseId}. Moving to the next course.`);
                    // Continue the loop for the next course
                } else {
                    console.log(`Course ${course.courseId} added successfully.`);
                    // If successful, you can break the loop here if desired
                }
            }, 4000);  // Adjust the timeout based on the page's response time
        } catch (error) {
            console.error(`Failed to add course: ${course.courseId}. Error: ${error}`);
        }
    }
}

// Function to check for error messages or warnings
function checkForError() {
    const errorMessage = document.querySelector('div.error, div.warning');

    // Debugging: log the error message
    if (errorMessage) {
        console.log("Error message found: ", errorMessage.textContent);
    }

    // Check for specific error codes and warnings
    if (errorMessage && (errorMessage.textContent.includes('Error Code') || errorMessage.textContent.includes('AP0501') || errorMessage.textContent.includes('You are not in the valid course add or change period'))) {
        console.error("Error detected: ", errorMessage.textContent);
        return true;  // Error detected
    }

    return false;  // No error detected
}

// Function to navigate back to the main course list
function navigateBackToCourseList() {
    const backButton = document.querySelector('a#ctl00_Body_lnkReturnToRWS'); // Adjust the selector as needed
    if (backButton) {
        backButton.click();
    } else {
        window.history.back();  // Fallback if no button is found
    }
}

// Main function to automate the registration process with course iteration
function automateRegistration() {
    let courses = JSON.parse(sessionStorage.getItem('courses'));

    if (isMainCoursePage()) {
        // We're on the main course page
        if (!courses) {
            // If courses are not in sessionStorage, get them
            courses = getCoursesFromRWS1();
            sessionStorage.setItem('courses', JSON.stringify(courses));
        }
        console.log("Found courses: ", courses);
        // Start attempting to add all courses in a loop
        attemptCourses(courses);
    } else {
        // Not on the main course page, handle errors if present
        if (checkForError()) {
            console.log("An error occurred, trying the next course.");
            navigateBackToCourseList();  // Go back to the main course list if needed
        } else {
            console.log("Course added successfully.");
            navigateBackToCourseList();
        }
    }
}

// Run the script
automateRegistration();
