using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace WU18.Kompassen.Web.Models
{
    public class Course
    {
        public Course()
        {
            StudentCourses = new HashSet<StudentCourses>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Term { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string Credits { get; set; }
        public bool Active { get; set; }
        [NotMapped]
        public IEnumerable<Student> Students => StudentCourses.Select(e => e.Student);

        private ICollection<StudentCourses> StudentCourses { get; set; }
    }
}
