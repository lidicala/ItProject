// Description: JavaScript file for the courses page
//not sure if we need to fill the html with the json file
// in that case i think we will need the "name" over there to be able to fill the html
// fetch('coursesData.json')
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.description)
//         document.querySelector("#test").innerHTML = data.description
// //        document.getElementbyId("#test").innerHTML = data.description
//           })

//fetching the json file and creating the html elements
//we can also use async await instead of .then
fetch('coursesData.json')
    .then(response => response.json()) 
    .then(data => {
        console.log(data.quarters);

       // Create a new h2 element for each quarter this one is for replace our h2 in the html
       // quarter 1 quarter 2 etc...
    for (let quarter in data.quarters) {
            const quarterNumber = document.createElement('h2'); 
            quarterNumber.textContent = `Quarter ${quarter.charAt(quarter.length - 1)}`; 
            document.querySelector("#test").appendChild(quarterNumber); 
            
            const courses = data.quarters[quarter];      
            const ul = document.createElement('ul'); 
            ul.setAttribute('id', quarter); 
           
            courses.forEach(course => { 
                const li = document.createElement('li'); 
                li.classList.add('course');  
                li.setAttribute('id', course.id); 
                li.setAttribute('data-prerequisites', course.prerequisites.join(", ")); 
                li.textContent = course.name;  
                
                ul.appendChild(li); 
            });           
            document.querySelector("#test").appendChild(ul);
        }
    })
    .catch(error => console.error('Error loading the JSON:', error));


//prePrerequisites data 
let prePrerequisites = [];

async function loadCoursesData() {
    const response = await fetch('coursesData.json'); 
    const data = response.json(); 

    // global use
    prePrerequisites = data.prePrerequisites; 

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
    const courseItem = document.getElementById(courseId);
    if (!courseItem) return;
    
    // Remove any existing status classes
    courseItem.classList.remove("status-taken", "status-in-progress", "status-eligible", "status-not-eligible", "status-not-taken");

    if (status === "taken") {        
        courseItem.classList.add("status-taken"); 

        // Update dependent courses to "eligible"
        const dependentCourses = getDependentCourses(courseId);
        dependentCourses.forEach(dependentCourseId => {
            const dependentCourseItem = document.getElementById(dependentCourseId);
            if (dependentCourseItem) {
                const prerequisitesMet = checkPrerequisites(dependentCourseId);
                if (prerequisitesMet) {
                    dependentCourseItem.classList.remove("status-not-eligible", "status-not-taken");
                    dependentCourseItem.classList.add("status-eligible");
                }
            }
        });

    } else if (status === "in-progress") {
        courseItem.classList.add("status-in-progress");

    } else if (status === "not-taken") {
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
    const course = Object.values(coursesByQuarter).flat().find(c => c.id === courseId);
    if (!course) return false;

    return course.prerequisites.every(prereq => {
        if (prereq.includes(" or ")) {
            const options = prereq.split(" or ");
            return options.some(option => {
                const prereqItem = document.getElementById(option.trim());
                return prereqItem && prereqItem.classList.contains("status-taken");
            });
        }

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

// Function to check if a course is a prePrerequisite
function isPrePrerequisite(courseId) {
    return prePrerequisites.some(preReq => preReq.id === courseId);
}

function addCourseOptions() {
    const courseElements = document.querySelectorAll(".course, .prereq");

    courseElements.forEach(courseElement => {
        const courseId = courseElement.id;

        courseElement.addEventListener("click", () => {
            // Remove any existing dropdowns
            document.querySelectorAll(".status-dropdown").forEach(dropdown => dropdown.remove());

            // Check if the course should have a dropdown
            const prerequisitesMet = checkPrerequisites(courseId);
            const isPreReq = isPrePrerequisite(courseId);

            // If the course is NOT a prePrerequisite and its prerequisites are NOT met
            if (!isPreReq && !prerequisitesMet) {
                return;
            }

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
                button.textContent = option.label;

                button.addEventListener("click", () => {
                    updateCourseStatus(courseId, option.value);
                    dropdown.remove();
                });

                dropdown.appendChild(button);
            });

            courseElement.appendChild(dropdown); 
        });
    });
}