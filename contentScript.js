// Object to store subsections for each main course
const savedSubsections = {};

// Function to check if the current page is the main RWS1 page (list of main courses)
function isMainCoursePage() {
    return document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]') !== null;
}

// Function to get all courses on the main RWS1 page
function getCoursesAndSubsections() {
    const courses = [];
    
    // Ensure we only get courses from the RWS1 tab
    const rws1Tab = document.querySelector('div[id="ctl00_Body_tabRWS_tpnRWS1"]');
    
    if (rws1Tab) {
        const addCourseLinks = rws1Tab.querySelectorAll('a.lnkAddCourse');  // Restrict the query to within RWS1

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
    }

    return courses;
}

// Function to get the saved subsection for a given course
function getSavedSubsection(courseId) {
    return savedSubsections[courseId] || null;
}

// Function to add the main course with error handling
function addMainCourse(course) {
    try {
        console.log(`Attempting to add main course: ${course.dept} ${course.schcode} ${course.crs} section ${course.section}`);
        course.link.click();  // Click the "Add Course" link
    } catch (error) {
        console.error(`Failed to add course: ${course.dept} ${course.schcode} ${course.crs} section ${course.section}`);
    }
}

// Function to add a subsection with error handling
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
                try {
                    console.log(`Attempting to add subsection: ${dept} ${schcode} ${crs} section ${subsection}`);
                    link.click();  // Click the "Add Course" link for the subsection
                } catch (error) {
                    console.error(`Failed to add subsection: ${dept} ${schcode} ${crs} section ${subsection}`);
                }
            }
        });
    } else {
        console.log(`No subsection found for course: ${dept} ${schcode} ${crs}`);
    }
}

// Main function to automate the registration process with course iteration
function automateRegistration() {
    if (isMainCoursePage()) {
        // We're on the main course page, get all courses and subsections
        const mainCourses = getCoursesAndSubsections();
        
        // Loop through the main courses and add them, ensuring that it continues to the next course even if one fails
        mainCourses.forEach((course) => {
            addMainCourse(course);  // Try to add the course, even if one fails, continue to the next
        });

    } else if (isSubsectionPage()) {
        // We're on a subsection page, add the saved subsection for the current course
        const firstSubsectionLink = document.querySelector('a.lnkAddCourse');
        if (firstSubsectionLink) {
            const dept = firstSubsectionLink.getAttribute('dept');
            const schcode = firstSubsectionLink.getAttribute('schcode');
            const crs = firstSubsectionLink.getAttribute('crs');
            addSubsection(dept, schcode, crs);  // Try to add the subsection, even if one fails, continue
        }
    }
}

// Run the script
automateRegistration();