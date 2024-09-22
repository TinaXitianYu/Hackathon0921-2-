// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to get all courses from RWS1
function getCoursesFromRWS1() {
    const courses = [];
    const rws1Tab = document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]');
    if (rws1Tab) {
        const addCourseLinks = rws1Tab.querySelectorAll('a.lnkAddCourse');
        addCourseLinks.forEach((link) => {
            const dept = link.getAttribute('dept');
            const schcode = link.getAttribute('schcode');
            const crs = link.getAttribute('crs');
            const section = link.getAttribute('sec');
            const courseId = `${dept} ${schcode} ${crs} ${section}`;
            courses.push({ courseId, dept, schcode, crs, section, link });
        });
    }
    return courses;
}

// Function to attempt adding a course
function attemptCourse(courses, courseIndex) {
    if (courseIndex >= courses.length) {
        console.log("All courses have been attempted.");
        return;
    }

    const course = courses[courseIndex];
    console.log(`Attempting to add course: ${course.courseId}`);

    // Store the current course index in sessionStorage
    sessionStorage.setItem('currentCourseIndex', courseIndex);
    sessionStorage.setItem('courses', JSON.stringify(courses));

    try {
        // Click the "Add Course" link
        course.link.click();
        console.log(`Clicked on course: ${course.courseId}`);

        // The page may reload or navigate, so the rest of the code may not execute.
        // We'll rely on the script re-running on page load and checking for errors.
    } catch (error) {
        console.error(`Failed to add course: ${course.courseId}. Error: ${error}`);
        // Move to the next course
        courseIndex++;
        sessionStorage.setItem('currentCourseIndex', courseIndex);
        // Reload the page to continue
        location.reload();
    }
}

// Function to check for error messages or warnings
function checkForError() {
    // Logging for debugging purposes
    const errorMessage = document.querySelector('div.error, div.warning');
    if (errorMessage) {
        console.log("Error message found: ", errorMessage.textContent);
    } else {
        console.log("No error message found.");
    }

    // Adjusting to detect specific errors or warnings
    if (errorMessage && (errorMessage.textContent.includes('Error Code') || errorMessage.textContent.includes('warning'))) {
        console.error("Error detected: ", errorMessage.textContent);
        return true;  // Error detected
    }

    return false;  // No error detected
}

// Main function to automate the registration process with course iteration
function automateRegistration() {
    let currentCourseIndex = parseInt(sessionStorage.getItem('currentCourseIndex')) || 0;
    let courses = JSON.parse(sessionStorage.getItem('courses'));

    if (isMainCoursePage()) {
        // We're on the main course page
        if (!courses) {
            // If courses are not in sessionStorage, get them
            courses = getCoursesFromRWS1();
            sessionStorage.setItem('courses', JSON.stringify(courses));
        }
        console.log("Found courses: ", courses);
        // Start attempting to add the courses one by one
        attemptCourse(courses, currentCourseIndex);
    } else {
        // Not on the main course page
        // Check for errors
        if (checkForError()) {
            // Error encountered, move to next course
            currentCourseIndex++;
            sessionStorage.setItem('currentCourseIndex', currentCourseIndex);
            // Navigate back to the main course page
            navigateBackToCourseList();
        } else {
            // Course added successfully
            console.log("Course added successfully.");
            // Proceed to next course if desired
            currentCourseIndex++;
            sessionStorage.setItem('currentCourseIndex', currentCourseIndex);
            // Navigate back to the main course page
            navigateBackToCourseList();
        }
    }
}

// Function to navigate back to the main course list
function navigateBackToCourseList() {
    // Try clicking on a specific link or button that takes you back
    const backButton = document.querySelector('a#ctl00_Body_lnkReturnToRWS'); // Adjust the selector as needed
    if (backButton) {
        backButton.click();
    } else {
        // If there's no such link, you might use history.back()
        window.history.back();
    }
}

// Run the script
automateRegistration();
