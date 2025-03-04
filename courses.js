// Global variables to store data
let prePrerequisites = [];
let coursesByQuarter = {};

// Function to load the JSON file based on the selected program
function loadDegree(degree) {
  const degreeFile = `/itProject/${degree}.json`; // Ensure correct path for Live Server
  console.log(degreeFile);

  fetch(degreeFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      prePrerequisites = data.prePrerequisites;
      coursesByQuarter = data.quarters;
      displayCourses(data);
    })
    .catch((error) => console.error("Error loading JSON:", error));
}


// Function to display courses on the webpage
function displayCourses(data) {
  document.querySelector("#test").innerHTML = "";

  displayPrePrerequisites(data.prePrerequisites);

  for (let quarter in data.quarters) {
    const quarterTitle = document.createElement("h2");
    quarterTitle.textContent = quarter.replace("quarter", "Quarter ");
    document.querySelector("#test").appendChild(quarterTitle);

    const courseList = document.createElement("ul");
    courseList.setAttribute("id", quarter);

    data.quarters[quarter].forEach((course) => {
      const courseItem = document.createElement("li");
      courseItem.classList.add("course");
      courseItem.setAttribute("id", course.id);
      courseItem.textContent = course.name;

      if (course.prerequisites.length > 0) {
        let prereqNames = course.prerequisites.map((prereq) => prereq.name).join(", ");
        courseItem.setAttribute("data-prerequisites", prereqNames);
      } else {
        courseItem.setAttribute("data-prerequisites", "None");
      }

      courseList.appendChild(courseItem);
    });

    document.querySelector("#test").appendChild(courseList);
  }

  addCourseOptions();
}

// Function to display pre-requisites
function displayPrePrerequisites(preReqs) {
  const preReqSection = document.querySelector("#pre-prerequisites");
  preReqSection.innerHTML = "";

  if (preReqs.length === 0) {
    return; // Don't display section if there are no pre-requisites
  }

  const preReqHeader = document.createElement("h2");
  preReqHeader.textContent = "Pre-Prerequisites";
  preReqSection.appendChild(preReqHeader);

  const preReqList = document.createElement("ul");
  preReqList.setAttribute("id", "pre-prerequisites-list");

  preReqs.forEach((preReq) => {
    const li = document.createElement("li");
    li.classList.add("prereq");
    li.setAttribute("id", preReq.id);
    li.textContent = preReq.name;
    preReqList.appendChild(li);
  });

  preReqSection.appendChild(preReqList);
}

// Function to check if prerequisites are met
function checkPrerequisites(courseId) {
  const course = Object.values(coursesByQuarter).flat().find((c) => c.id === courseId);
  if (!course) return false;

  return course.prerequisites.every((prereq) => {
    const prereqItem = document.getElementById(prereq.id);
    return prereqItem && prereqItem.classList.contains("status-taken");
  });
}

// Function to update course status
function updateCourseStatus(courseId, status) {
  const courseItem = document.getElementById(courseId);
  if (!courseItem) return;

  courseItem.classList.remove(
    "status-taken",
    "status-in-progress",
    "status-eligible",
    "status-not-eligible",
    "status-not-taken"
  );

  if (status === "taken") {
    courseItem.classList.add("status-taken");

    // Update dependent courses
    getDependentCourses(courseId).forEach((dependentCourseId) => {
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
  } else {
    courseItem.classList.add("status-not-taken");
    resetCourses(courseId);
  }
}

// Function to reset courses
function resetCourses(courseId) {
  getDependentCourses(courseId).forEach((dependentCourseId) => {
    const dependentCourseItem = document.getElementById(dependentCourseId);
    if (dependentCourseItem) {
      const prerequisitesMet = checkPrerequisites(dependentCourseId);
      if (!prerequisitesMet) {
        dependentCourseItem.classList.remove("status-eligible", "status-in-progress", "status-taken");
        dependentCourseItem.classList.add("status-not-eligible");
        resetCourses(dependentCourseId);
      }
    }
  });
}

// Function to get courses that depend on a given course
function getDependentCourses(courseId) {
  return Object.values(coursesByQuarter).flat()
    .filter((course) => course.prerequisites.some((prereq) => prereq.id === courseId))
    .map((course) => course.id);
}

// Function to check if a course is a pre-requisite
function isPrePrerequisite(courseId) {
  return prePrerequisites.some((preReq) => preReq.id === courseId);
}

// Function to add course dropdown menu for status updates
function addCourseOptions() {
  document.querySelectorAll(".course, .prereq").forEach((courseElement) => {
    courseElement.addEventListener("click", () => {
      document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
        if (!courseElement.contains(dropdown)) dropdown.remove();
      });

      const existingDropdown = courseElement.querySelector(".status-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      const dropdown = document.createElement("div");
      dropdown.className = "status-dropdown";

      ["taken", "in-progress", "not-taken"].forEach((status) => {
        const button = document.createElement("button");
        button.textContent = `Mark as ${status.replace("-", " ")}`;
        button.addEventListener("click", () => {
          updateCourseStatus(courseElement.id, status);
          dropdown.remove();
        });
        dropdown.appendChild(button);
      });

      courseElement.appendChild(dropdown);
    });
  });
}
