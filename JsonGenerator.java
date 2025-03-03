import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.*;

// Website for this code
// https://jenkov.com/tutorials/java-json/jackson-objectmapper.html#read-object-from-json-via-url
public class JsonGenerator 
{
    public static void main(String[] args) throws Exception 
    {
        List<Course> courses = DatabaseUtils.getCoursesFromDatabase();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File("output.json"), courses);
    }
}
