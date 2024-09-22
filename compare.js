// Object to store subsections for each main course
const savedSubsections = {};

// Load the course list from localStorage
let courseList = JSON.parse(localStorage.getItem('courses')) || [];

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to iterate over the course list and attempt registration
function iterateAndRegisterCourses() {
    for (let course of courseList) {
        if (!course.registered) { // Only register courses that haven't been registered
            const courseLink = findCourseLink(course);
            if (courseLink) {
                try {
                    console.log(`Attempting to register for ${course.dept} ${course.schcode} ${course.crs} section ${course.section}`);
                    courseLink.click(); // Click the link to add the course
                    course.registered = true; // Mark course as registered
                    localStorage.setItem('courses', JSON.stringify(courseList)); // Save updated status in localStorage
                    break; // Exit loop after registering one course
                } catch (error) {
                    console.error(`Failed to register ${course.dept} ${course.schcode} ${course.crs} section ${course.section}`);
                }
            }
        }
    }
}

// Function to find the course link on the page based on course attributes
function findCourseLink(course) {
    const rws1Tab = document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]');
    if (rws1Tab) {
        const addCourseLinks = rws1Tab.querySelectorAll('a.lnkAddCourse');
        for (let link of addCourseLinks) {
            if (
                link.getAttribute('dept') === course.dept &&
                link.getAttribute('schcode') === course.schcode &&
                link.getAttribute('crs') === course.crs &&
                link.getAttribute('sec') === course.section
            ) {
                return link; // Return the correct course link
            }
        }
    }
    return null;
}

// Main function to automate the registration process
function automateRegistration() {
    if (isMainCoursePage()) {
        iterateAndRegisterCourses(); // Try to register for courses
    } else if (isSubsectionPage()) {
        // Handle subsection registration here (similar logic)
    }
}

// Run the script
automateRegistration();
