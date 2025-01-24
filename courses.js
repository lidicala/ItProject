// Class for defining a course
class Course {
    constructor(id, prerequisites = []) {
        this.id = id;
        this.prerequisites = prerequisites;
        this.status = '';
    }
}

// Group courses by quarters 
const coursesByQuarter = {
    quarter1: [
        new Course("csd110", ["none"]),
        new Course("csd112", ["none"]),
        new Course("engl101", ["none"]),
    ],
    quarter2: [
        new Course("cs141", ["csd110"]),
        new Course("csd122", ["csd110", "csd112"]),
        new Course("csd138", ["csd110"]),
    ],
    quarter3: [
        new Course("cs143", ["cs141"]),
        new Course("csd268", ["cs141"]),
        new Course("math141", ["MATH 99", "placement into MATH& 141"]),
    ],
    quarter4: [
        new Course("art102", ["ABED 40", "AHSE 56", "ABED 46"]),
        new Course("phys&114", ["MATH 111", "MATH& 142"]),
        new Course("soc&101", ["ENGL 93", "placement into ENGL 99 or higher"]),
    ],
    quarter5: [
        new Course("csd230", ["cs143", "csd228"]),
        new Course("csd275", ["csd110", "csd112"]),
        new Course("csd233", ["cs143"]), // as either a prerequisite or corequisite
    ],
    quarter6: [
        new Course("csd228", ["cs141"]),
        new Course("csd298", ["cs143"]),
        new Course("dsgn290", ["art102"]),
        new Course("csd297", ["csd112", "csd122", "csd138", "cs141", "csd228 or csd268"]),
        new Course("csd235", ["cs143"]), // OR "cs141" as a prerequisite
    ],

    genEdCourses: [
        new Course("engl101-gen", ["ENGL 99", "placement into ENGL& 101"]),
        new Course("math141-gen", ["MATH 99", "placement into MATH& 141"]),
        new Course("phys114", ["MATH 111", "MATH& 142"]),
        new Course("soc101", ["ENGL 93", "placement into ENGL 99"]),
        new Course("art102", ["ABED 40", "AHSE 56", "placement into MATH 87", "placement into ENGL 93"]),
    ]
};

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

// Initialize the dropdown functionality for all courses
addCourseOptions();