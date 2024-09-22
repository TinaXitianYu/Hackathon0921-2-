// Object to store subsections for each main course
const savedSubsections = {};

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to check if the current page is a subsection page
function isSubsectionPage() {
    // Assuming subsection pages have a specific identifier (adjust as needed)
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS2"]') !== null;
}

// Function to get the first course from RWS1 and try to add it
function getFirstCourseFromRWS1() {
    const rws1Tab = document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]');
    if (rws1Tab) {
        const addCourseLinks = rws1Tab.querySelectorAll('a.lnkAddCourse');
        if (addCourseLinks.length > 0) {
            const firstCourseLink = addCourseLinks[0];  // Get the first course link
            const dept = firstCourseLink.getAttribute('dept');
            const schcode = firstCourseLink.getAttribute('schcode');
            const crs = firstCourseLink.getAttribute('crs');
            const section = firstCourseLink.getAttribute('sec');

            // Try to add the first course
            try {
                console.log(`Attempting to add first course: ${dept} ${schcode} ${crs} section ${section}`);
                firstCourseLink.click();  // Click the first "Add Course" link
            } catch (error) {
                console.error(`Failed to add first course: ${dept} ${schcode} ${crs} section ${section}`);
            }
        } else {
            console.error("No courses found in RWS1 tab.");
        }
    }
}

// Main function to automate the registration process with course iteration
function automateRegistration() {
    if (isMainCoursePage()) {
        // We're on the main course page, get the first course and attempt to add it
        getFirstCourseFromRWS1();
    } else if (isSubsectionPage()) {
        // We're on a subsection page, handle adding subsections here
        const firstSubsectionLink = document.querySelector('a.lnkAddCourse');
        if (firstSubsectionLink) {
            const dept = firstSubsectionLink.getAttribute('dept');
            const schcode = firstSubsectionLink.getAttribute('schcode');
            const crs = firstSubsectionLink.getAttribute('crs');
            addSubsection(dept, schcode, crs);  // Try to add the subsection
        }
    }
}

// Run the script
automateRegistration();
