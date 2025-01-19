// Course Class Definition
class Course {
    constructor(id, prerequisites = []) {
        this.id = id;
        this.prerequisites = prerequisites;
        // this.taken = false;
        this.status = '';

    }
}

// Initialize courses
// const courses = [
//     new Course("csd110"),
//     new Course("csd112"),
//     new Course("engl101"),
//     new Course("cs141", ["csd110"]),
//     new Course("csd122", ["csd110", "csd112"]),
//     new Course("csd138", ["csd110"]),
//     new Course("cs143", ["cs141"]),
//     new Course("csd268", ["cs141"]),
//     new Course("csd230", ["cs143 or csd228"]),
//     new Course("csd275", ["csd110", "csd112"]),
//     new Course("csd233", ["cs143"]),
//     new Course("csd228", ["cs141"]),
//     new Course("csd298", ["cs143"]),
//     new Course("dsgn290", ["art102"]),
//     new Course("csd297", ["csd112", "csd122", "csd138", "cs141", "csd228 or csd268"]),
//     new Course("csd235", ["cs143"]),
// ];

// Initialize courses by quarters I did it in this way to have a better organization of the courses
// I mean for me was easier to see the courses by quarter, but if you prefer to have all the courses in the same array
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
        new Course("csd230", ["csd143", "csd228"]),
        new Course("csd275", ["csd110", "csd112"]),
        new Course("csd233", ["cs143"]), //as either a prerequisite or corequisite
    ],
    quarter6: [
        new Course("csd228", ["cs141"]),
        new Course("csd298", ["csd143"]),
        new Course("dsgn290", ["art102"]),
        new Course("csd297", ["csd112", "csd122", "csd138", "cs141", "csd228 or csd268"]),
        new Course("csd235", ["csd143"]), // OR "cs141" as a prerequisite 
    ],
    //we dont have specific id for this course, so I just put the name of the course
    genEdCourses: [
        new Course("engl101-gen", ["ENGL 99", "placement into ENGL& 101"]),
        new Course("math141-gen", ["MATH 99", "placement into MATH& 141"]),
        new Course("phys114", ["MATH 111", "MATH& 142"]),
        new Course("soc101", ["ENGL 93", "placement into ENGL 99"]),
        new Course("art102", ["ABED 40", "AHSE 56", "placement into MATH 87", "placement into ENGL 93"]),
    ]
};


// This function adds a dropdown menu next to each course when clicked
// I mean, when a user clicks on a course, it shows options to mark it as "Taken" or "In Progress".
// But if the dropdown is already visible (because the user clicked on the course before), 
// we remove the old one first to avoid having more than one dropdown on the screen.
function addCourseOptions() {
    // Select all elements with the class "course"
    const courseElements = document.querySelectorAll(".course");
    
    // Loop through each course element
    courseElements.forEach(courseElement => {
        // Add an event listener to handle click events
        courseElement.addEventListener("click", () => {
            // Check if there's an existing dropdown menu
            const existingDropdown = courseElement.querySelector(".status-dropdown");
            if (existingDropdown) {
                existingDropdown.remove(); // Remove the dropdown if it exists
                return; // Exit if the dropdown was removed
            }

            // Create a new dropdown menu
            const dropdown = document.createElement("div");
            dropdown.className = "status-dropdown"; // Add the class for styling

            // Define the options for the dropdown menu
            //we can also think what options we want to show to the user
            const options = [
                { label: "Mark as Taken", value: "taken" },
                { label: "Mark as In Progress", value: "in-progress" },
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

                dropdown.appendChild(button); // Append the button to the dropdown
            });

            // Add the dropdown menu to the course element
            courseElement.appendChild(dropdown); 
        });
    });
}

// Initialize the functionality
addCourseOptions();

