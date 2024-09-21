// Object to store subsections for each main course
const savedSubsections = {};

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id^="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to check if the current page is a subsection page
// Function to check if the current page is a subsection page by looking for "Select Lab"
function isSubsectionPage() {
    const selectLabText = document.querySelector('span#ctl00_Body_lblColSelect');
    return selectLabText !== null && selectLabText.textContent.includes('Select Lab');
}

// Function to get all courses on the main RWS1 page
function getCoursesAndSubsections() {
    const courses = [];
    const addCourseLinks = document.querySelectorAll('a.lnkAddCourse');

    addCourseLinks.forEach((link) => {
        const dept = link.getAttribute('dept');  // Get department (e.g., E37)
        const schcode = link.getAttribute('schcode');  // Get school code (e.g., E)
        const crs = link.getAttribute('crs');  // Get course number (e.g., 202)
        const section = link.getAttribute('sec');  // Get section number (e.g., 01 or A)
        const sectype = link.getAttribute('sectype');  // Get type (S for main course, D for subsection)

        const courseId = `${dept} ${schcode} ${crs} ${section}`;  // Create unique identifier for the course

        if (sectype === 'S') {
            // If it's a main course, save it for registration
            courses.push({ courseId, dept, schcode, crs, section, link });
        } else if (sectype === 'D') {
            // If it's a subsection, save it for the corresponding main course
            const mainCourseId = `${dept} ${schcode} ${crs}`;  // Use dept, schcode, and crs to identify the main course
            savedSubsections[mainCourseId] = section;  // Save the subsection (e.g., A, B, etc.)
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
    console.log(`Adding main course: ${course.dept} ${course.schcode} ${course.crs} section ${course.section}`);
    course.link.click();  // Click the "Add Course" link
}

// Function to add a subsection
function addSubsection(dept, schcode, crs) {
    const mainCourseId = `${dept} ${schcode} ${crs}`;
    const subsection = getSavedSubsection(mainCourseId);
    if (subsection) {
        // Loop through all the "Add Course" links on the subsection page to find the saved subsection
        const addSubsectionLinks = document.querySelectorAll('a.lnkAddCourse');
        addSubsectionLinks.forEach((link) => {
            const linkSection = link.getAttribute('sec');
            const linkDept = link.getAttribute('dept');
            const linkSchcode = link.getAttribute('schcode');
            const linkCrs = link.getAttribute('crs');

            // Ensure we match the correct course by department, school code, and course number
            if (linkDept === dept && linkSchcode === schcode && linkCrs === crs && linkSection === subsection) {
                console.log(`Adding subsection: ${dept} ${schcode} ${crs} section ${subsection}`);
                link.click();  // Click the "Add Course" link for the subsection
            }
        });
    } else {
        console.log(`No subsection found for course: ${dept} ${schcode} ${crs}`);
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
        const firstSubsectionLink = document.querySelector('a.lnkAddCourse');
        if (firstSubsectionLink) {
            const dept = firstSubsectionLink.getAttribute('dept');
            const schcode = firstSubsectionLink.getAttribute('schcode');
            const crs = firstSubsectionLink.getAttribute('crs');
            addSubsection(dept, schcode, crs);
        }
    }
}

// Run the script
automateRegistration();

