using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace WU18.Kompassen.Web.Models
{
    public class Student
    {
        public Student()
        {
            StudentCourses = new HashSet<StudentCourses>();
        }

        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Ssn { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        [NotMapped]
        public IEnumerable<Course> Courses => StudentCourses.Select(e => e.Course);

        private ICollection<StudentCourses> StudentCourses { get; set; }


    }
}
