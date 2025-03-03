import java.sql.*;
import java.util.*;

public class DatabaseUtils 
{
    // Website for some of this code
    // https://www.geeksforgeeks.org/establishing-jdbc-connection-in-java/
    // Not sure about these three lines

    // Find MySQL database
    private static String url = "";
    // DB username
    private static String user = "";
    // DB password
    private static String password = "";

    // I tried to write it similar to what is on the website 
    // but I'm not sure if it's gonna work properly in our case

    // String url = "";
    // String username = "";
    // String password = "";

    public static List<Course> getCoursesFromDatabase() throws SQLException 
    {
        List<Course> courses = new ArrayList<>();
        Connection conn = DriverManager.getConnection(url, user, password);
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM courses");

        while (rs.next()) 
        {
            Course course = new Course(rs.getString("id"), rs.getString("name"));
            courses.add(course);
        }

        rs.close();
        stmt.close();
        conn.close();
        return courses;
    }
}
