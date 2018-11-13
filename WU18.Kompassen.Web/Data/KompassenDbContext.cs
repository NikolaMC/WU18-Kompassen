using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WU18.Kompassen.Web.Models;

namespace WU18.Kompassen.Web.Data
{
    public class KompassenDbContext : DbContext
    {
        public KompassenDbContext(DbContextOptions<KompassenDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<StudentCourses> StudentCourses { get; set; }
        public virtual DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StudentCourses>(entity =>
            {
                entity.HasKey(e => new { e.StudentId, e.CourseId });

                entity.Property(e => e.StudentId).HasColumnName("Student_Id");

                entity.Property(e => e.CourseId).HasColumnName("Course_Id");

                entity.HasOne(d => d.Course)
                    .WithMany("StudentCourses")
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("FK_dbo.StudentCourses_dbo.Courses_Course_Id");

                entity.HasOne(d => d.Student)
                    .WithMany("StudentCourses")
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_dbo.StudentCourses_dbo.Students_Student_Id");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.Property(e => e.Ssn).HasColumnName("SSN");
            });
        }
    }
}
