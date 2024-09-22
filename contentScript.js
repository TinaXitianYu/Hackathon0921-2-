// Object to store subsections for each main course
const savedSubsections = {};
let currentCourseIndex = 0;  // Track the current course being attempted

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to check if the current page is a subsection page
function isSubsectionPage() {
    // Assuming subsection pages have a specific identifier (adjust as needed)
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS2"]') !== null;
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

    try {
        // Click the "Add Course" link
        course.link.click();
        setTimeout(() => {
            // After attempting to add the course, check for errors or warnings
            if (checkForError()) {
                console.log(`Error encountered when adding course: ${course.courseId}. Moving to the next course.`);
                attemptCourse(courses, courseIndex + 1);  // Move to the next course if there's an error
            } else {
                console.log(`Course ${course.courseId} added successfully.`);
            }
        }, 2000);  // Give time for the page to update before checking for errors
    } catch (error) {
        console.error(`Failed to add course: ${course.courseId}`);
        attemptCourse(courses, courseIndex + 1);  // Move to the next course if there's a failure
    }
}

// Function to check for error messages or warnings
function checkForError() {
    const errorMessages = document.querySelectorAll('div.error, div.warning');
    for (let errorMessage of errorMessages) {
        if (errorMessage.textContent.includes('Error Code') || errorMessage.textContent.includes('warning')) {
            console.error("Error or warning detected: ", errorMessage.textContent);
            return true;  // Error or warning detected
        }
    }
    return false;  // No error detected
}

// Main function to automate the registration process with course iteration
function automateRegistration() {
    if (isMainCoursePage()) {
        // We're on the main course page, get all courses and subsections
        const mainCourses = getCoursesFromRWS1();
        // Start attempting to add the courses one by one
        attemptCourse(mainCourses, currentCourseIndex);
    } else if (isSubsectionPage()) {
        console.log("Subsection page detected. Handling subsections.");
        // Handle subsections if needed (not in this example)
    }
}

// Run the script
automateRegistration();
