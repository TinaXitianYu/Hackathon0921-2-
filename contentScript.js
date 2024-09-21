// Object to store subsections for each main course
const savedSubsections = {};

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id^="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to check if the current page is a subsection page
function isSubsectionPage() {
    return document.querySelector('table.MainTableRow') !== null;
}

// Function to get all courses on the main RWS1 page
function getCoursesAndSubsections() {
    const courses = [];
    const addCourseLinks = document.querySelectorAll('a.lnkAddCourse');

    addCourseLinks.forEach((link) => {
        const courseId = link.getAttribute('crs');  // Get course code (e.g., 131)
        const section = link.getAttribute('sec');  // Get section number (e.g., 01 or A)
        const sectype = link.getAttribute('sectype');  // Get type (S for main course, D for subsection)

        if (sectype === 'S') {
            // If it's a main course, save it for registration
            courses.push({ courseId, section, link });
        } else if (sectype === 'D') {
            // If it's a subsection, save it for the corresponding main course
            savedSubsections[courseId] = section;  // Save the subsection (e.g., A, B, etc.)
        }
    });

    return courses;
}

// Function to get the saved subsection for a given course
function getSavedSubsection(courseId) {
    return savedSubsections[courseId] || null;
}

// Function to add the main course
function addMainCourse(course) {
    console.log(`Adding main course: ${course.courseId} section ${course.section}`);
    course.link.click();  // Click the "Add Course" link
}

// Function to add a subsection
function addSubsection(courseId) {
    const subsection = getSavedSubsection(courseId);
    if (subsection) {
        // Loop through all the "Add Course" links on the subsection page to find the saved subsection
        const addSubsectionLinks = document.querySelectorAll('a.lnkAddCourse');
        addSubsectionLinks.forEach((link) => {
            const linkSection = link.getAttribute('sec');
            if (linkSection === subsection) {
                console.log(`Adding subsection: ${courseId} section ${subsection}`);
                link.click();  // Click the "Add Course" link for the subsection
            }
        });
    } else {
        console.log(`No subsection found for course: ${courseId}`);
    }
}

// Main function to automate the registration process
function automateRegistration() {
    if (isMainCoursePage()) {
        // We're on the main course page, get all courses and subsections
        const mainCourses = getCoursesAndSubsections();
        
        // Loop through the main courses and add them
        mainCourses.forEach((course) => {
            addMainCourse(course);
        });

    } else if (isSubsectionPage()) {
        // We're on a subsection page, add the saved subsection for the current course
        const currentCourseId = document.querySelector('a.lnkAddCourse').getAttribute('crs');
        addSubsection(currentCourseId);
    }
}

// Run the script
automateRegistration();

