// Course Class Definition
class Course {
    constructor(id, prerequisites = []) {
        this.id = id;
        this.prerequisites = prerequisites;
        this.taken = false;
    }
}

// Initialize courses
const courses = [
    new Course("csd110"),
    new Course("csd112"),
    new Course("engl101"),
    new Course("cs141", ["csd110"]),
    new Course("csd122", ["csd110", "csd112"]),
    new Course("csd138", ["csd110"]),
    new Course("cs143", ["cs141"]),
    new Course("csd268", ["cs141"]),
    new Course("csd230", ["cs143 or csd228"]),
    new Course("csd275", ["csd110", "csd112"]),
    new Course("csd233", ["cs143"]),
    new Course("csd228", ["cs141"]),
    new Course("csd298", ["cs143"]),
    new Course("dsgn290", ["art102"]),
    new Course("csd297", ["csd112", "csd122", "csd138", "cs141", "csd228 or csd268"]),
    new Course("csd235", ["cs143"]),
];

