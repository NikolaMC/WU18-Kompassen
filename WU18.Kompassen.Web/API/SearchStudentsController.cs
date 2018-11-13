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
    public class SearchStudentsController : ControllerBase
    {
        private readonly KompassenDbContext _context;

        public SearchStudentsController(KompassenDbContext context)
        {
            _context = context;
        }

        [HttpGet("{query}")]
        public IActionResult Get([FromRoute] string query)
        {
            var results = _context.Students
                .Include("StudentCourses.Course").Where(x => x.FirstName.Contains(query)
                || x.LastName.Contains(query)
                || x.Ssn.Contains(query));

            if (results == null)
            {
                return NotFound();
            }

            return Ok(results);
        }
    }
}
