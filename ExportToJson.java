import java.sql.*;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

//for adding mysql connector to vscode
//1. open vscode
//2. contrl + shift + p
//3. go to Java configure classpath
//4. click on libraries
//5. click on add.
//6. <yourfilepath>\lib\mysql-connector-j-9.2.0.jar
//7. click ok


public class ExportToJson {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/itProjectDB11";
        String user = "root";
        String password = "test123"; //add pw

        try (Connection conn = DriverManager.getConnection(url, user, password)) { //https://docs.oracle.com/javase/8/docs/api/java/sql/DriverManager.html#getConnection-java.lang.String-
            
            String outputDir = System.getProperty("user.dir") + "/itProject"; //https://www.geeksforgeeks.org/getproperty-and-getproperties-methods-of-system-class-in-java/
            Files.createDirectories(Paths.get(outputDir));

            // Generate JSON for CSD and BusinessTech separately
            writeJsonFile(conn, outputDir, "CSD", "csd.json");
            writeJsonFile(conn, outputDir, "BusinessTech", "businessTech.json");

            System.out.println("JSON files created in: " + outputDir);
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }

    private static void writeJsonFile(Connection conn, String outputDir, String programName, String fileName) throws SQLException, IOException {
        // Get program ID from database
        int programId = getProgramId(conn, programName);

        // Define output file path
        String outputFilePath = outputDir + "/" + fileName;
        FileWriter file = new FileWriter(outputFilePath);

        // Generate JSON Data
        StringBuilder jsonOutput = new StringBuilder("{\n");
        jsonOutput.append("\"prePrerequisites\": ").append(getPrePrerequisites(conn, programId)).append(",\n");
        jsonOutput.append("\"quarters\": ").append(getQuartersWithCourses(conn, programId)).append("\n");
        jsonOutput.append("}");

        // Write JSON to File
        file.write(jsonOutput.toString());
        file.close();
    }

    private static int getProgramId(Connection conn, String programName) throws SQLException {
        String query = "SELECT program_id FROM Programs WHERE program_name = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(query); //https://docs.oracle.com/javase/8/docs/api/java/sql/PreparedStatement.html
            preparedStatement.setString(1, programName); //https://docs.oracle.com/javase/8/docs/api/java/sql/PreparedStatement.html#setString-int-java.lang.String-
            ResultSet resultSet = preparedStatement.executeQuery(); //https://docs.oracle.com/javase/7/docs/api/java/sql/Statement.html#executeQuery(java.lang.String)
            if (resultSet.next()) { //https://docs.oracle.com/javase/8/docs/api/java/sql/ResultSet.html#next--,  //https://docs.oracle.com/javase/7/docs/api/java/sql/ResultSet.html#next()
                return resultSet.getInt("program_id");
            }
        return -1; // not found
    }

    private static String getPrePrerequisites(Connection conn, int programId) throws SQLException {
        StringBuilder prePrerequisites = new StringBuilder("[\n");
        String query;
    
        if (programId == 1) { // CSD Program
            query = "SELECT DISTINCT c.course_id, c.course_name " +
                    "FROM Courses c " +
                    "WHERE c.course_name IN ('ENGL 93', 'ENGL& 99', 'MATH 99')";
        } else if (programId == 2) { // Business Tech Program
            query = "SELECT DISTINCT c.course_id, c.course_name " +
                    "FROM Courses c " +
                    "WHERE c.course_name IN ('ENGL 93', 'MATH 99', 'ENGL& 99', 'BTE 105 Keyboarding I')";
        } else {
            return "[]"; // empty if invalid program id
        }
    
        PreparedStatement statement = conn.prepareStatement(query);
        ResultSet rs = statement.executeQuery();
    
        boolean first = true;
        while (rs.next()) {
            if (!first) prePrerequisites.append(",\n");
            first = false;
            prePrerequisites.append("    {")
                .append("\"id\": \"course")
                .append(rs.getInt("course_id")).append("\", ")
                .append("\"name\": \"").append(rs.getString("course_name")).append("\"}");
            }
    
        prePrerequisites.append("\n]");
        return prePrerequisites.toString();
    }
    
    
    
    private static String getQuartersWithCourses(Connection conn, int programId) throws SQLException {
        String query = "SELECT quarter_id, quarter_name FROM Quarters WHERE program_id = ? ORDER BY quarter_id";

        StringBuilder quartersJson = new StringBuilder("{\n");

        try (PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            preparedStatement.setInt(1, programId);
            ResultSet resultSet = preparedStatement.executeQuery();
            ArrayList<String> quarterNames = new ArrayList<>();

            while (resultSet.next()) {
                quarterNames.add(resultSet.getString("quarter_name"));
            }

            boolean firstQuarter = true;
            for (String quarterName : quarterNames) {
                if (!firstQuarter) quartersJson.append(",\n");
                firstQuarter = false;

                quartersJson.append("    \"").append(quarterName).append("\": [\n")
                        .append(getCoursesForQuarter(conn, quarterName, programId))
                        .append("\n    ]");
            }
        }
        quartersJson.append("\n  }");
        return quartersJson.toString();
    }

    private static String getCoursesForQuarter(Connection conn, String quarterName, int programId) throws SQLException {
        String query = "SELECT c.course_id, c.course_name FROM QuarterCourses qc " +
                       "JOIN Courses c ON qc.course_id = c.course_id " +
                       "JOIN Quarters q ON qc.quarter_id = q.quarter_id " +
                       "WHERE q.program_id = ? AND q.quarter_name = ? " +
                       "ORDER BY qc.quarter_id";

        StringBuilder coursesJson = new StringBuilder();
        boolean firstCourse = true;

            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, programId);
            pstmt.setString(2, quarterName);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                if (!firstCourse) coursesJson.append(",\n");
                firstCourse = false;

                coursesJson.append("      {")
                        .append("\"id\": \"course").append(rs.getInt("course_id")).append("\", ")
                        .append("\"name\": \"").append(rs.getString("course_name")).append("\", ")
                        .append("\"prerequisites\": ").append(getCoursePrerequisites(conn, rs.getInt("course_id")))
                        .append("}");
            }
        return coursesJson.toString();
    }

    private static String getCoursePrerequisites(Connection conn, int courseId) throws SQLException {
        String query = "SELECT p.prerequisite_id, c.course_name " +
                       "FROM CoursePrerequisites p " +
                       "JOIN Courses c ON p.prerequisite_id = c.course_id " +
                       "WHERE p.course_id = ?";
        StringBuilder prerequisites = new StringBuilder("[");
        boolean first = true;

        PreparedStatement preparedStatement = conn.prepareStatement(query);
        preparedStatement.setInt(1, courseId);
        ResultSet resultSet = preparedStatement.executeQuery();

        while (resultSet.next()) {
            if (!first) prerequisites.append(", ");
            first = false;

            prerequisites.append("{")
                        .append("\"id\": \"course").append(resultSet.getInt("prerequisite_id")).append("\", ")
                        .append("\"name\": \"").append(resultSet.getString("course_name")).append("\"}");
            }
        prerequisites.append("]");
        return prerequisites.toString();
    }
}
