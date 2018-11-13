using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WU18.Kompassen.Web.Data;
using WU18.Kompassen.Web.Models;

namespace WU18.Kompassen.Web.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentCoursesController : ControllerBase
    {
        private readonly KompassenDbContext _context;

        public StudentCoursesController(KompassenDbContext context)
        {
            _context = context;
        }
        
        // POST: api/StudentCourses
        [HttpPost]
        public async Task<IActionResult> PostStudentCourses([FromBody] StudentCourses studentCourses)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = _context.Courses.FirstOrDefault(c => c.Id == studentCourses.CourseId);
            var student = _context.Students.FirstOrDefault(s => s.Id == studentCourses.StudentId);

            if (course == null || student == null)
            {
                return BadRequest();
            }

            var studentCoursesEntry = new StudentCourses
            {
                CourseId = course.Id,
                StudentId = student.Id,
                Course = course,
                Student = student
            };

            _context.StudentCourses.Add(studentCoursesEntry);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentCoursesExists(studentCourses.StudentId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentCourses", new { id = studentCoursesEntry.StudentId }, studentCoursesEntry);
        }

        // DELETE: api/studentcourses
        [HttpDelete]
        public async Task<IActionResult> DeleteStudentCourses([FromBody] StudentCourses studentCourses)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studentCoursesEntry = await _context.StudentCourses.FindAsync(studentCourses.StudentId, studentCourses.CourseId);
            if (studentCoursesEntry == null)
            {
                return NotFound();
            }

            _context.StudentCourses.Remove(studentCoursesEntry);
            await _context.SaveChangesAsync();

            return Ok(studentCoursesEntry);
        }

        private bool StudentCoursesExists(int id)
        {
            return _context.StudentCourses.Any(e => e.StudentId == id);
        }
    }
}