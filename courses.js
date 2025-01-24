async function loadCoursesData() {
    const response = await fetch('coursesData.json'); 
    const data = await response.json(); 
    return data.quarters; 
}

let coursesByQuarter = {};

loadCoursesData().then(courses => {
    coursesByQuarter = courses;
    console.log(coursesByQuarter); 
    addCourseOptions();
});


// Class for defining a course
class Course {
    constructor(id, prerequisites = []) {
        this.id = id;
        this.prerequisites = prerequisites;
        this.status = '';
    }
}

// Function to update the status of a course and its prerequisite courses
function updateCourseStatus(courseId, status) {
    const courseItem = document.getElementById(courseId);  // Get the course element by ID
    if (!courseItem) return;

    // Remove any existing status classes
    courseItem.classList.remove("status-taken", "status-in-progress", "status-eligible", "status-not-eligible", "status-not-taken");

    // Add the new status class based on the selected status
    if (status === "taken") {
        // Mark the course as "taken"
        courseItem.classList.add("status-taken"); 

        // Update dependent courses to "eligible"
        const dependentCourses = getDependentCourses(courseId);
        dependentCourses.forEach(dependentCourseId => {
            const dependentCourseItem = document.getElementById(dependentCourseId);
            if (dependentCourseItem) {
                const prerequisitesMet = checkPrerequisites(dependentCourseId);
                if (prerequisitesMet) {
                    dependentCourseItem.classList.remove("status-not-eligible", "status-not-taken");
                    dependentCourseItem.classList.add("status-eligible"); // Mark as "eligible"
                }
            }
        });

    } else if (status === "in-progress") {
        // Mark the course as "in-progress"
        courseItem.classList.add("status-in-progress");

    } else if (status === "not-taken") {
        // Reset the course status to "not-taken"
        courseItem.classList.add("status-not-taken"); 

        // Reset dependent courses to "not-eligible"
        const dependentCourses = getDependentCourses(courseId);
        dependentCourses.forEach(dependentCourseId => {
            const dependentCourseItem = document.getElementById(dependentCourseId);
            if (dependentCourseItem) {
                const prerequisitesMet = checkPrerequisites(dependentCourseId);
                if (!prerequisitesMet) {
                    dependentCourseItem.classList.remove("status-eligible", "status-in-progress", "status-taken");
                    dependentCourseItem.classList.add("status-not-eligible");
                }
            }
        });
    }
}

// Check if all prerequisites for a course are met
function checkPrerequisites(courseId) {
    // Find the course object based on its ID
    const course = Object.values(coursesByQuarter).flat().find(c => c.id === courseId);
    if (!course) return false;

    // Check if all prerequisites are marked as "taken"
    return course.prerequisites.every(prereq => {
        // Handle "or" prerequisites
        if (prereq.includes(" or ")) {
            const options = prereq.split(" or ");
            return options.some(option => {
                const prereqItem = document.getElementById(option.trim());
                return prereqItem && prereqItem.classList.contains("status-taken");
            });
        }

        // Handle standard prerequisites
        const prereqItem = document.getElementById(prereq.trim());
        return prereqItem && prereqItem.classList.contains("status-taken");
    });
}

// Function to get courses that depend on a given course (prerequisite courses)
function getDependentCourses(courseId) {
    const dependentCourses = [];
    Object.values(coursesByQuarter).flat().forEach(course => {
        if (course.prerequisites.includes(courseId) || course.prerequisites.some(prereq => prereq.includes(courseId))) {
            dependentCourses.push(course.id);
        }
    });
    return dependentCourses;
}

// Add a dropdown menu to each course for updating status
function addCourseOptions() {
    // Get all course elements
    const courseElements = document.querySelectorAll(".course");
    
    // Loop through each course element
    courseElements.forEach(courseElement => {
        // Add an event listener to handle click events
        courseElement.addEventListener("click", () => {
            const existingDropdown = courseElement.querySelector(".status-dropdown");
            if (existingDropdown) {
                // If it exists, remove it 
                existingDropdown.remove();
                return; // Exit the function to avoid creating a new dropdown
            }

            // Remove dropdowns from other courses
            document.querySelectorAll(".status-dropdown").forEach(dropdown => dropdown.remove());   
                     
            // Create a new dropdown menu
            const dropdown = document.createElement("div");
            dropdown.className = "status-dropdown"; 

            // Define the options for the dropdown menu
            const options = [
                { label: "Mark as Taken", value: "taken" },
                { label: "Mark as In Progress", value: "in-progress" },
                { label: "Reset to Not-Taken", value: "not-taken" }
            ];

            // Loop through each option and create a button for it
            options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option.label; // Set the button label

                // Add an event listener for each button option
                button.addEventListener("click", () => {
                    const courseId = courseElement.id; // Get the ID of the clicked course
                    updateCourseStatus(courseId, option.value); // Update the course status based on the option selected
                    dropdown.remove(); // Remove the dropdown after selecting an option
                });

                dropdown.appendChild(button); // Attach the dropdown to the course
            });

            // Add the dropdown menu to the course element
            courseElement.appendChild(dropdown); 
        });
    });
}

