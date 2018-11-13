using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WU18.Kompassen.Web.Models
{
    public class StudentCourses
    {
        [Required]
        public int StudentId { get; set; }
        [Required]
        public int CourseId { get; set; }

        public Course Course { get; set; }
        public Student Student { get; set; }
    }
}
