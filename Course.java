import java.util.List;

public class Course 
{
    private String id;
    private String name;
    private List<Prerequisite> prerequisites;

    public Course(String id, String name) 
    {
        this.id = id;
        this.name = name;
    }

    public String getId() 
    { 
        return id; 
    }
    public String getName() 
    { 
        return name; 
    }


    public static class Prerequisite 
    {
        private String id;
        private String name;
        
        public Prerequisite(String id, String name) 
        {
            this.id = id;
            this.name = name;
        }
        
        public String getId() 
        { 
            return id; 
        }
        public String getName() 
        { 
            return name; 
        }
    }
}
