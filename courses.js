// Base class for all courses
class Course 
{
    constructor(name, prerequisites = []) 
    {
        this.name = name;
        this.prerequisites = prerequisites;
        this.isTaken = false;
        this.status = "not-eligible";
    }

    // Check if the course is eligible 
    isEligible(takenCourses) 
    {

    }

    // Mark the course as taken
    markAsTaken() 
    {
        this.isTaken = true;
        this.status = "taken";
    }
}

// Class to manage taken classes
class Progress
{

}

