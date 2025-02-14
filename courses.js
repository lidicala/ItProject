// take json file, create mySQL data base , so the data will be in mySQL instead of json files
// tables in sql, populate with the same data as json files 

// Global variable to store pre-prerequisites
let prePrerequisites = [];

// Store courses by quarter
let coursesByQuarter = {};

// Function to load degree data based on the selected degree
function loadDegree(degree) {
  let degreeFile;

  // Decide which JSON file to load
  if (degree === "bs") {
    degreeFile = "businessTech.json";
  } else if (degree === "csd") {
    degreeFile = "csd.json";
  }
  console.log(degreeFile);

  // Fetch the selected JSON file
  fetch(degreeFile)
    .then((response) => response.json())
    .then((data) => {
      // Save prePrerequisites and quarters globally
      prePrerequisites = data.prePrerequisites;
      coursesByQuarter = data.quarters;

      // Display the courses in the #test div
      displayCourses(data);

      // Set up the dropdown option
      addCourseOptions();
    });
}

// Function to display the courses on the webpage
function displayCourses(data) {
  // Clear previous courses before displaying new ones
  document.querySelector("#test").innerHTML = "";

  // Check if the "pre-prerequisites" section exists
  if (document.querySelector("#pre-prerequisites")) {

    // Clear previous pre-prerequisites before displaying new ones
    document.querySelector("#pre-prerequisites").innerHTML = "";

    // Create and add a heading for the pre-prerequisites
    const preReqHeader = document.createElement("h2");
    preReqHeader.textContent = "Pre-Prerequisites";
    document.querySelector("#pre-prerequisites").appendChild(preReqHeader);

    // Add a subtitle for the pre-prerequisites
    const subTitle = document.createElement("p");
    subTitle.textContent = "To take the classes below, you must first complete or be enrolled in at least one of the following:";
    document.querySelector("#pre-prerequisites").appendChild(subTitle);

    // Create an unordered list for the pre-prerequisites
    const ul = document.createElement("ul");
    ul.setAttribute("id", "pre-prerequisites");
    document.querySelector("#pre-prerequisites").appendChild(ul);

    // Go through each pre-prerequisite course and add it to the list
    for (let preReq of data.prePrerequisites) {
      const li = document.createElement("li");
      li.classList.add("prereq");
      li.setAttribute("id", preReq.id);
      li.textContent = preReq.name;
      ul.appendChild(li);
    }
  }

  // Go through each quarter in the JSON data
  for (let quarter in data.quarters) {
    // Create and add a header for the quarter
    const quarterNumber = document.createElement("h2");
    quarterNumber.textContent = `Quarter ${quarter.charAt(quarter.length - 1)}`;
    document.querySelector("#test").appendChild(quarterNumber);

    const courses = data.quarters[quarter]; // Get the courses for the current quarter
    const ul = document.createElement("ul"); // Create an unordered list
    ul.setAttribute("id", quarter); // Set the ID of the list

    // Go through each course and add it to the list
    courses.forEach((course) => {
      const li = document.createElement("li");
      li.classList.add("course");
      li.setAttribute("id", course.id);

      // Get the full names of the prerequisites
      let fullPrereqNames = course.prerequisites.map((prereq) => prereq.name).join(", ");
      li.setAttribute("data-prerequisites", fullPrereqNames);

      li.textContent = course.name;

      ul.appendChild(li); // Add the course to the list
    });
    document.querySelector("#test").appendChild(ul); // Add the list to the page
  }
}


// Function to check if prerequisites are met for a course
function checkPrerequisites(courseId) {
  // Find the course by ID
  const course = Object.values(coursesByQuarter).flat().find((c) => c.id === courseId);
  if (!course) return false;

  // Check if all prerequisites are met
  return course.prerequisites.every((prereqObj) => {
    const prereqItem = document.getElementById(prereqObj.id);
    return prereqItem && prereqItem.classList.contains("status-taken");
  });
}

// Function to update the status of a course and its prerequisite courses
function updateCourseStatus(courseId, status) {
  const courseItem = document.getElementById(courseId);
  if (!courseItem) return;

  // Remove any existing status classes
  courseItem.classList.remove(
    "status-taken",
    "status-in-progress",
    "status-eligible",
    "status-not-eligible",
    "status-not-taken"
  );

  if (status === "taken") {
    courseItem.classList.add("status-taken");

    // Update dependent courses to "eligible" if their prerequisites are now met
    const dependentCourses = getDependentCourses(courseId);
    dependentCourses.forEach((dependentCourseId) => {
      const dependentCourseItem = document.getElementById(dependentCourseId);
      if (dependentCourseItem) {
        const prerequisitesMet = checkPrerequisites(dependentCourseId);
        if (prerequisitesMet) {
          dependentCourseItem.classList.remove(
            "status-not-eligible",
            "status-not-taken"
          );
          dependentCourseItem.classList.add("status-eligible");
        }
      }
    });
  } else if (status === "in-progress") {
    courseItem.classList.add("status-in-progress");
  } else if (status === "not-taken") {
    courseItem.classList.add("status-not-taken");

    // Reset all dependent courses that are no longer eligible
    resetCourses(courseId);
  }
}

// Function to reset courses that aren't eligible
function resetCourses(courseId) {
  const dependentCourses = getDependentCourses(courseId);

  dependentCourses.forEach((dependentCourseId) => {
    const dependentCourseItem = document.getElementById(dependentCourseId);
    if (dependentCourseItem) {
      const prerequisitesMet = checkPrerequisites(dependentCourseId);
      // If this course is no longer eligible, reset it
      if (!prerequisitesMet) {
        dependentCourseItem.classList.remove(
          "status-eligible",
          "status-in-progress",
          "status-taken"
        );
        dependentCourseItem.classList.add("status-not-eligible");

        resetCourses(dependentCourseId);
      }
    }
  });
}

// Function to get courses that depend on a given course (prerequisite courses)
function getDependentCourses(courseId) {
  const dependentCourses = [];
  // Loop through all courses in all quarters
  Object.values(coursesByQuarter).flat().forEach((course) => {
    // Check if the current course has courseId as a prerequisite
    if (course.prerequisites.some((prereqObj) => prereqObj.id === courseId)) {
      dependentCourses.push(course.id);
    }
  });
  return dependentCourses;
}

// Function to check if a course is a pre-prerequisites
function isPrePrerequisite(courseId) {
  return prePrerequisites.some((preReq) => preReq.id === courseId);
}

// Function to add course options (the dropdown)
function addCourseOptions() {
  const courseElements = document.querySelectorAll(".course, .prereq");

  courseElements.forEach((courseElement) => {
    const courseId = courseElement.id;

    courseElement.addEventListener("click", () => {
      // Remove any dropdowns on OTHER courses
      document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
        // Remove dropdowns from other elements
        if (!courseElement.contains(dropdown)) {
          dropdown.remove();
        }
      });

      // Check if THIS course already has a dropdown
      const existingDropdown = courseElement.querySelector(".status-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      // Remove any existing dropdowns
      document.querySelectorAll(".status-dropdown").forEach((dropdown) => dropdown.remove());

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
        { label: "Reset to Not-Taken", value: "not-taken" },
      ];

      // Loop through each option and create a button for it
      options.forEach((option) => {
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
