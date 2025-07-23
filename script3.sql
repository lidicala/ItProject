-- Create Database
CREATE DATABASE IF NOT EXISTS itProjectDB11;
USE itProjectDB11;

DROP TABLE IF EXISTS CoursePrerequisites;
DROP TABLE IF EXISTS ProgramPrerequisites;
DROP TABLE IF EXISTS QuarterCourses; 
DROP TABLE IF EXISTS Quarters; 
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Programs;



CREATE TABLE Programs (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    program_name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE Quarters (
    quarter_id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    quarter_name ENUM('quarter1', 'quarter2', 'quarter3', 'quarter4', 'quarter5', 'quarter6') NOT NULL,
    UNIQUE (program_id, quarter_name), 
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
);


CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL
);

CREATE TABLE QuarterCourses (
    quarter_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (quarter_id, course_id),
    FOREIGN KEY (quarter_id) REFERENCES Quarters(quarter_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE CoursePrerequisites (
    course_id INT NOT NULL,
    prerequisite_id INT NOT NULL,
    PRIMARY KEY (course_id, prerequisite_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE ProgramPrerequisites (
    program_id INT NOT NULL,
    prerequisite_course_id INT NOT NULL,
    PRIMARY KEY (program_id, prerequisite_course_id),
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

INSERT INTO Programs (program_name) VALUES
('CSD'),
('BusinessTech');

INSERT INTO Quarters (program_id, quarter_name) VALUES
(1, 'quarter1'), (1, 'quarter2'), (1, 'quarter3'), (1, 'quarter4'), (1, 'quarter5'), (1, 'quarter6'),
(2, 'quarter1'), (2, 'quarter2'), (2, 'quarter3'), (2, 'quarter4'), (2, 'quarter5'), (2, 'quarter6');

INSERT INTO Courses (course_name) VALUES
-- preprereqs
('ENGL 93'), 
('MATH 99'), 
('MATH 111'), 
('ENGL& 99'), 
('BTE 105 Keyboarding I'),

-- CSD Program Courses
-- Q1
('CSD 110 Python Fundamentals'),
-- ('CSD 112 HTML and CSS'),
-- ('ENGL& 101 English Composition I'),

-- Q2
('CS& 141 Computer Science I Java'),
('CSD 122 JavaScript'),
('CSD 138 SQL'),

-- Q3
('CS 143 Computer Science II Java'),
('CSD 268 Quality Assurance Methodologies'),
('MATH& 141 Pre-Calculus I'),

-- Q4
-- ('ART 102 Introduction to 2D Design'),
('PHYS& 114 General Physics I w/Lab'),
('SOC& 101 Introduction to Sociology'),

-- Q5
('CSD 230 Mobile Programming'),
('CSD 275 PHP Scripting'),
('CSD 233 C++ Programming'),

-- Q6
('CSD 228 C# Programming'),
('CSD 298 Technical Interview/Job Search'),
('DSGN 290 Portfolio/Job Search'),
('CSD 297 IT Project'),
('CSD 235 Algorithms and Data Structures'),

-- BusinessTech Program Courses
-- Q1
('BTE 111 Word I'),
('BTE 120 Business Computer Management'),
('BTE 130 Business English I'),

-- Q2
('BTE 124 PowerPoint'),
('MATH& 107 Math in Society'),
('BTE 112 Excel I'),

-- Q3
('ENGL& 101 English Composition I'),
('BTE 212 Excel II'),
('BTE 281 Project Management With Microsoft Project'),

-- Q4
('BTE 114 Access'),
('BTE 106 Keyboarding II'),
('ART 102 Introduction to 2D Design'),
('BUS& 101 Introduction to Business'),

-- Q5
('BTE 135 Outlook'),
('BTE 211 Word II'),
('CSD 112 HTML and CSS'),

-- Q6
('BTE 125 Web-Based Technologies'),
('BTE 195 Capstone Project'),
('PSYC& 100 General Psychology'),
('BTE 191 Customer Service/Help Desk');


INSERT INTO QuarterCourses (quarter_id, course_id)
SELECT q.quarter_id, c.course_id 
FROM Quarters q, Courses c 
WHERE 
    -- CSD Quarter 1
    (q.program_id = 1 AND q.quarter_name = 'quarter1' AND c.course_name IN 
        ('CSD 110 Python Fundamentals', 'CSD 112 HTML and CSS', 'ENGL& 101 English Composition I'))
    
    -- CSD Quarter 2
    OR (q.program_id = 1 AND q.quarter_name = 'quarter2' AND c.course_name IN 
        ('CS& 141 Computer Science I Java', 'CSD 122 JavaScript', 'CSD 138 SQL'))
    
    -- CSD Quarter 3
    OR (q.program_id = 1 AND q.quarter_name = 'quarter3' AND c.course_name IN 
        ('CS 143 Computer Science II Java', 'CSD 268 Quality Assurance Methodologies', 'MATH& 141 Pre-Calculus I'))
    
    -- CSD Quarter 4
    OR (q.program_id = 1 AND q.quarter_name = 'quarter4' AND c.course_name IN 
        ('ART 102 Introduction to 2D Design', 'PHYS& 114 General Physics I w/Lab', 'SOC& 101 Introduction to Sociology'))
    
    -- CSD Quarter 5
    OR (q.program_id = 1 AND q.quarter_name = 'quarter5' AND c.course_name IN 
        ('CSD 230 Mobile Programming', 'CSD 275 PHP Scripting', 'CSD 233 C++ Programming'))
    
    -- CSD Quarter 6
    OR (q.program_id = 1 AND q.quarter_name = 'quarter6' AND c.course_name IN 
        ('CSD 228 C# Programming', 'CSD 298 Technical Interview/Job Search', 
         'DSGN 290 Portfolio/Job Search', 'CSD 297 IT Project', 'CSD 235 Algorithms and Data Structures'))
    
    -- BusinessTech Quarter 1
    OR (q.program_id = 2 AND q.quarter_name = 'quarter1' AND c.course_name IN 
        ('BTE 111 Word I', 'BTE 120 Business Computer Management', 'BTE 130 Business English I'))
    
    -- BusinessTech Quarter 2
    OR (q.program_id = 2 AND q.quarter_name = 'quarter2' AND c.course_name IN 
        ('BTE 124 PowerPoint', 'MATH& 107 Math in Society', 'BTE 112 Excel I'))
    
    -- BusinessTech Quarter 3
    OR (q.program_id = 2 AND q.quarter_name = 'quarter3' AND c.course_name IN 
        ('ENGL& 101 English Composition I', 'BTE 212 Excel II', 'BTE 281 Project Management With Microsoft Project'))
    
    -- BusinessTech Quarter 4
    OR (q.program_id = 2 AND q.quarter_name = 'quarter4' AND c.course_name IN 
        ('BTE 114 Access', 'BTE 106 Keyboarding II', 'ART 102 Introduction to 2D Design', 'BUS& 101 Introduction to Business'))
    
    -- BusinessTech Quarter 5
    OR (q.program_id = 2 AND q.quarter_name = 'quarter5' AND c.course_name IN 
        ('BTE 135 Outlook', 'BTE 211 Word II', 'CSD 112 HTML and CSS'))
    
    -- BusinessTech Quarter 6
    OR (q.program_id = 2 AND q.quarter_name = 'quarter6' AND c.course_name IN 
        ('BTE 125 Web-Based Technologies', 'BTE 195 Capstone Project', 
         'PSYC& 100 General Psychology', 'BTE 191 Customer Service/Help Desk'));

INSERT INTO CoursePrerequisites (course_id, prerequisite_id)
SELECT c1.course_id, c2.course_id
FROM Courses c1, Courses c2
WHERE
    -- Q1 Prerequisites
    (c1.course_name = 'ENGL& 101 English Composition I' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'CSD 110 Python Fundamentals' AND c2.course_name = 'ENGL& 101 English Composition I') OR
--     (c1.course_name = 'CSD 112 HTML and CSS' AND c2.course_name = 'ENGL& 101 English Composition I') OR
    (c1.course_name = 'BTE 111 Word I' AND c2.course_name = 'BTE 120 Business Computer Management') OR
    (c1.course_name = 'BTE 120 Business Computer Management' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'BTE 130 Business English I' AND c2.course_name = 'ENGL 93') OR
    

    -- Q2 Prerequisites
    (c1.course_name = 'CS& 141 Computer Science I Java' AND c2.course_name = 'CSD 110 Python Fundamentals') OR
    (c1.course_name = 'CSD 122 JavaScript' AND c2.course_name IN ('CSD 110 Python Fundamentals', 'CSD 112 HTML and CSS')) OR
    (c1.course_name = 'CSD 138 SQL' AND c2.course_name = 'CSD 110 Python Fundamentals') OR
    (c1.course_name = 'BTE 124 PowerPoint' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'MATH& 107 Math in Society' AND c2.course_name = 'MATH 99') OR
    (c1.course_name = 'BTE 112 Excel I' AND c2.course_name = 'BTE 120 Business Computer Management') OR

    -- Q3 Prerequisites
    (c1.course_name = 'CS 143 Computer Science II Java' AND c2.course_name = 'CS& 141 Computer Science I Java') OR
    (c1.course_name = 'CSD 268 Quality Assurance Methodologies' AND c2.course_name = 'CS& 141 Computer Science I Java') OR
    (c1.course_name = 'MATH& 141 Pre-Calculus I' AND c2.course_name = 'MATH 99') OR
    (c1.course_name = 'ENGL& 101 English Composition I' AND c2.course_name = 'ENGL& 99') OR
    (c1.course_name = 'BTE 212 Excel II' AND c2.course_name = 'BTE 112 Excel I') OR
    (c1.course_name = 'BTE 281 Project Management With Microsoft Project' AND c2.course_name = 'BTE 120 Business Computer Management') OR

    -- Q4 Prerequisites
    (c1.course_name = 'ART 102 Introduction to 2D Design' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'PHYS& 114 General Physics I w/Lab' AND c2.course_name = 'MATH 111') OR
    (c1.course_name = 'SOC& 101 Introduction to Sociology' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'BTE 114 Access' AND c2.course_name = 'BTE 120 Business Computer Management') OR
    (c1.course_name = 'BTE 106 Keyboarding II' AND c2.course_name = 'BTE 105 Keyboarding I') OR
    (c1.course_name = 'BUS& 101 Introduction to Business' AND c2.course_name = 'ENGL& 99') OR

    -- Q5 Prerequisites
    (c1.course_name = 'CSD 230 Mobile Programming' AND c2.course_name = 'CS 143 Computer Science II Java') OR
    (c1.course_name = 'CSD 275 PHP Scripting' AND c2.course_name IN ('CSD 110 Python Fundamentals', 'CSD 112 HTML and CSS')) OR
    (c1.course_name = 'CSD 233 C++ Programming' AND c2.course_name = 'CS 143 Computer Science II Java') OR
    (c1.course_name = 'BTE 135 Outlook' AND c2.course_name = 'BTE 120 Business Computer Management') OR
    (c1.course_name = 'BTE 211 Word II' AND c2.course_name = 'BTE 111 Word I') OR
    (c1.course_name = 'CSD 112 HTML and CSS' AND c2.course_name = 'ENGL 93') OR

    -- Q6 Prerequisites
    (c1.course_name = 'CSD 228 Programming with C#' AND c2.course_name = 'CS& 141 Computer Science I Java') OR
    (c1.course_name = 'CSD 235 Algorithms and Data Structures' AND c2.course_name = 'CS 143 Computer Science II Java') OR
    (c1.course_name = 'CSD 297 IT Project' AND c2.course_name IN ('CSD 112 HTML and CSS', 'CSD 122 JavaScript', 
                        'CSD 138 SQL', 'CS& 141 Computer Science I Java', 
                        'CSD 228 C# Programming', 'CSD 268 Quality Assurance Methodologies')) OR
    (c1.course_name = 'DSGN 290 Portfolio/Job Search' AND c2.course_name = 'ART 102 Introduction to 2D Design') OR
    (c1.course_name = 'BTE 125 Web-Based Technologies' AND c2.course_name IN ('BTE 106 Keyboarding II', 'BTE 120 Business Computer Management')) OR
    (c1.course_name = 'PSYC& 100 General Psychology' AND c2.course_name = 'ENGL 93') OR
    (c1.course_name = 'BTE 191 Customer Service/Help Desk' AND c2.course_name = 'ENGL 93');


-- csd
INSERT INTO ProgramPrerequisites (program_id, prerequisite_course_id)
SELECT p.program_id, c.course_id
FROM Programs p, Courses c
WHERE p.program_name = 'CSD'
AND c.course_name IN ('ENGL 93', 'MATH 99', 'MATH 111');

-- biztech
INSERT INTO ProgramPrerequisites (program_id, prerequisite_course_id)
SELECT p.program_id, c.course_id
FROM Programs p, Courses c
WHERE p.program_name = 'BusinessTech'
AND c.course_name IN ('ENGL 93', 'MATH 99', 'ENGL& 99', 'BTE 105 Keyboarding I');


SELECT * FROM Programs;
SELECT * FROM Quarters;
SELECT * FROM Courses;
SELECT * FROM QuarterCourses;
SELECT * FROM CoursePrerequisites;
SELECT * FROM ProgramPrerequisites;




