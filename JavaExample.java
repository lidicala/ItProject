/*I just add this java file with some smalls parts of what I was doing 
but we need separate file, I added comment to the code with the different files that I think we need
and I also add comments to the code to explain what I was doing. 
I didn't want to create the same files that I have because I was not sure if this is the way to do it.
*/

/* First Java file: Course.java
This class represents a course, including its ID, name, and prerequisites.
It also includes an inner class for prerequisites and another for organizing courses by quarters.*/
public class Course {
    private String id;
    private String name;
    private List<Prerequisite> prerequisites; //I dont know how to handle this if as List of prerequisites because they are the same classes

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

     // Inner class representing prerequisites if we decided to handle them like that
    public static class Prerequisite {
        private String id;
        private String name;

        // Getters and setters
    }

    // Inner class organizing courses by quarters
    public static class Quarter {
        private List<Course> quarter1;
        private List<Course> quarter2;
        private List<Course> quarter3;
        private List<Course> quarter4;
        private List<Course> quarter5;
        private List<Course> quarter6;

        // Getters and setters
    }
}

/* Second Java file: PrePrerequisite.java
 This class represents general pre-requisites required before taking any courses.
We could integrate this into Course.java, but keeping it separate improves modularity. */
public class PrePrerequisite {
    private String id;
    private String name;

    // Getters and setters
}


/*Third Java file: DatabaseUtils.java
This class handles the database connection and retrieves courses from MySQL.
It fetches course details and stores them in a list. 

1. we need to connect to the MySQL database using JDBC. 
This is one of the way I found Without this, we can’t access the course data. 
We need to specify the connection parameters to establish a connection.

2. Once we’re connected, we need to run an SQL query to get all the courses. 
so basically we're asking the database to give us everything from the courses table. 
guessing here is when we start to work with the object called resultSet

3. Next, we loop through each row in the ResultSet. 
For every row (which represents a course), we create a new Course object 
and extract its ID and name. If we also need prerequisites, 
we’ll have to run another query or process that data separately
to make sure each course has the right prerequisites linked to it.

4. After that, we store all the course objects in a list. 
This list will later be converted into a JSON file.

This whole process is what allows us to pull data from MySQL and 
turn it into a JSON file. */

import java.sql.*;
import java.util.*;

public class DatabaseUtils {
    public static List<Course> getCoursesFromDatabase() throws SQLException {
        List<Course> courses = new ArrayList<>();

        // Establish a database connection (we need to specify the connection parameters)
        Connection conn = DriverManager.getConnection(); 

        // Here is the rest of the logic, querys and so on

        /* I took this one from a website so not sure if this is the way and but
        if its we need to adjust it
        String query = "SELECT * FROM courses";
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query); */

        // Loop through the ResultSet and create Course objects for each row
        while (rs.next()) {
            Course course = new Course();
            course.setId(rs.getString("id"));
            course.setName(rs.getString("name"));


    }
}

// Fourth Java file: JsonGenerator.java
// This class retrieves courses from the database and generates a JSON file.

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.*;

public class JsonGenerator {

    public static void main(String[] args) throws Exception {
        // recover/ Retrieve the courses from the database 
        List<Course> courses = DatabaseUtils.getCoursesFromDatabase();

        // Create a structure to store the JSON data
         // with our JSON , we need to define how to organize them.
        // One way is to use a HashMap to group courses based on criteria (e.g., by quarter).
        Map<String, Object> jsonStructure = new HashMap<>();

        // or maybe something like this
        String jsonString = mapper.writeValueAsString(person); // Convert object to JSON string
        
        // guessing we need to add the courses to the jsonStructure

        // Create the JSON File
    
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File("csd.json")); // Writing all courses to a single JSON file.
         // so far we have two JSON files so I think we should create separate writeValue calls for each one
         // Or maybe we need to do it with courses prerequites.
    }


    }
}


// This is an example from a website that I found online
// I am not sure if this is what we are looking for
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.*;

public class JacksonExample {

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        Person person = new Person("John", "Doe", 30);

        // I think this line is important because convert object to JSON 
        String jsonString = mapper.writeValueAsString(person); 
        System.out.println(jsonString);
    }
}

@JsonInclude(JsonInclude.Include.NON_NULL)
class Person {
    @JsonProperty("firstName")
    private String name;
    @JsonIgnore
    private String lastName;
    private int age;
    public Person(String name, String lastName, int age) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }

    public String getLastName() {
        return lastName;
    }

    public int getAge() {
        return age;
    }
}
