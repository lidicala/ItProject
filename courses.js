// Function to load degree data based on the selected degree
function loadDegree(degree) 
{
    let degreeFile;

    // Decide which JSON file to load 
    if (degree === "bs") 
    {
        degreeFile = "businessTech.json";
    } 
    else if (degree === "csd") 
    {
        degreeFile = "csd.json";
    }

    // Fetch the selected JSON file
    fetch(degreeFile)
        .then(response => response.json())
        .then(data => {
            displayCourses(data);
        });
}


// Function to display the courses on the webpage
function displayCourses(data) 
{
    // Clear previous courses before displaying new ones
    document.querySelector("#test").innerHTML = "";

    // Create a new h2 element for each quarter this one is for replace our h2 in the html
    // quarter 1 quarter 2 etc...
    // Go through each quarter in the JSON data
    for (let quarter in data.quarters) 
    {
        // Create and add a header for the quarter
        const quarterNumber = document.createElement("h2");
        quarterNumber.textContent = `Quarter ${quarter.charAt(quarter.length - 1)}`;
        document.querySelector("#test").appendChild(quarterNumber);

        const courses = data.quarters[quarter];   // Get the courses for the current quarter
        const ul = document.createElement("ul");  // Create an unordered list
        ul.setAttribute("id", quarter);           // Set the ID of the list

        // Go through each course and add it to the list
        courses.forEach(course => 
        {
            const li = document.createElement("li");
            li.classList.add("course");
            li.setAttribute("id", course.id);
            // li.setAttribute('data-prerequisites', course.prerequisites.join(", ")); 
            // li.textContent = course.name;  

            // Get the full names of the prerequisites
            let fullPrereqNames = course.prerequisites.map((prereq) => prereq.name).join(", ");

            li.setAttribute("data-prerequisites", fullPrereqNames);
            li.textContent = course.name;

            ul.appendChild(li);  // Add the course to the list
        });
        document.querySelector("#test").appendChild(ul);  // Add the list to the page
    }
}


// Function to handle degree selection
function chooseDegree(selectedDegree) 
{
    if (selectedDegree === "csd") 
    {
        loadDegree("csd"); 
    } 
    else if (selectedDegree === "bs") 
    {
        loadDegree("bs");  
    }
}


// Global variable to store pre-prerequisites
let prePrerequisites = [];

// Function to load course data
async function loadCoursesData() 
{
    const response = await fetch('coursesData.json');
    const data = response.json();

    // global use
    prePrerequisites = data.prePrerequisites;

    return data.quarters;
}

// Store courses by quarter
let coursesByQuarter = {};

// Load the course data and set up course options
loadCoursesData().then(courses => 
{
    coursesByQuarter = courses;     // Save courses globally
    console.log(coursesByQuarter);
    addCourseOptions();
});


// Function to check if prerequisites are met for a course
function checkPrerequisites(courseId) 
{
    // Find the course by ID
    const course = Object.values(coursesByQuarter).flat().find(c => c.id === courseId);
    if (!course) return false;

    // Check if all prerequisites are met
    return course.prerequisites.every(prereq => 
    {
        if (prereq.includes(" or ")) 
        {
            const options = prereq.split(" or ");
            return options.some(option => 
            {
                const prereqItem = document.getElementById(option.trim());
                return prereqItem && prereqItem.classList.contains("status-taken");
            });
        }

        const prereqItem = document.getElementById(prereq.trim());
        return prereqItem && prereqItem.classList.contains("status-taken");
    });
}


// Function to update the status of a course and its prerequisite courses
function updateCourseStatus(courseId, status) 
{
    const courseItem = document.getElementById(courseId);
    if (!courseItem) return;

    // Remove any existing status classes
    courseItem.classList.remove("status-taken", "status-in-progress", "status-eligible", "status-not-eligible", "status-not-taken");

    if (status === "taken") 
    {
        courseItem.classList.add("status-taken");

        // Update dependent courses to "eligible"
        const dependentCourses = getDependentCourses(courseId);
        dependentCourses.forEach(dependentCourseId => 
        {
            const dependentCourseItem = document.getElementById(dependentCourseId);
            if (dependentCourseItem) 
            {
                const prerequisitesMet = checkPrerequisites(dependentCourseId);
                if (prerequisitesMet) 
                {
                    dependentCourseItem.classList.remove("status-not-eligible", "status-not-taken");
                    dependentCourseItem.classList.add("status-eligible");
                }
            }
        });

    } 
    else if (status === "in-progress") 
    {
        courseItem.classList.add("status-in-progress");
    } 
    else if (status === "not-taken") 
    {
        courseItem.classList.add("status-not-taken");

        // Reset dependent courses to "not-eligible"
        const dependentCourses = getDependentCourses(courseId);
        dependentCourses.forEach(dependentCourseId => 
        {
            const dependentCourseItem = document.getElementById(dependentCourseId);
            if (dependentCourseItem) 
            {
                const prerequisitesMet = checkPrerequisites(dependentCourseId);
                if (!prerequisitesMet) 
                {
                    dependentCourseItem.classList.remove("status-eligible", "status-in-progress", "status-taken");
                    dependentCourseItem.classList.add("status-not-eligible");
                }
            }
        });
    }
}


// Function to get courses that depend on a given course (prerequisite courses)
function getDependentCourses(courseId) 
{
    const dependentCourses = [];
    Object.values(coursesByQuarter).flat().forEach(course => 
    {
        if (course.prerequisites.includes(courseId) || course.prerequisites.some(prereq => prereq.includes(courseId))) 
        {
            dependentCourses.push(course.id);
        }
    });
    return dependentCourses;
}

// Function to check if a course is a pre-rerequisite
function isPrePrerequisite(courseId) 
{
    return prePrerequisites.some(preReq => preReq.id === courseId);
}

// Function to add course options 
function addCourseOptions() 
{
    const courseElements = document.querySelectorAll(".course, .prereq");

    courseElements.forEach(courseElement => 
    {
        const courseId = courseElement.id;

        courseElement.addEventListener("click", () => 
        {
            // Remove any existing dropdowns
            document.querySelectorAll(".status-dropdown").forEach(dropdown => dropdown.remove());

            // Check if the course should have a dropdown
            const prerequisitesMet = checkPrerequisites(courseId);
            const isPreReq = isPrePrerequisite(courseId);

            // If the course is NOT a prePrerequisite and its prerequisites are NOT met
            if (!isPreReq && !prerequisitesMet) 
            {
                return;
            }

            // Create a new dropdown menu
            const dropdown = document.createElement("div");
            dropdown.className = "status-dropdown";

            // Define the options for the dropdown menu
            const options = 
            [
                { label: "Mark as Taken", value: "taken" },
                { label: "Mark as In Progress", value: "in-progress" },
                { label: "Reset to Not-Taken", value: "not-taken" }
            ];

            // Loop through each option and create a button for it
            options.forEach(option => 
            {
                const button = document.createElement("button");
                button.textContent = option.label;

                button.addEventListener("click", () => 
                {
                    updateCourseStatus(courseId, option.value);
                    dropdown.remove();
                });

                dropdown.appendChild(button);
            });

            courseElement.appendChild(dropdown);
        });
    });
}