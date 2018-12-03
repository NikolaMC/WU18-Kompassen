












$("#panel2").hide();
$("#panel3").hide();
$("#navKurser").on("click", function () {

    $("#panel1").show();
    $("#panel2").hide();
    $("#panel3").hide();

});

$("#navAddNewStudent").on("click", function () {

    $("#panel2").hide();
    $("#panel1").hide();
    $("#panel3").show();

});

$("#navStudenter").on("click", function () {

    $("#panel2").show();
    $("#panel1").hide();
    $("#panel3").hide();

});

/* $("#navNyKurs").on("click", function () {

     $("#panel3").show();
     $("#panel1").hide();
     $("#panel2").hide();

 });*/

//---------------------------------------------------------------------------------------------

var $courseTable = $("#coursesTable");
var $courseTable1 = $("#coursesTable1");
var $courseName = $("#kurser_Namn");
var $coursePoints = $("#kurser_Poäng");
var $courseYear = $("#kurser_År");
var $courseTerm = $("#kurser_Termin");
var $courseActive = $("#kurser_Aktiv");
var activeTrue;

function appendCourse(courseNew) {

    var activeChecked = '<input type="checkbox" checked="checked" disabled="disabled" id="courseActive' + courseNew.id + '"></td>';
    var activeUnchecked = '<input type="checkbox" disabled="disabled" id="courseActive' + courseNew.id + '"></td>';
    var activeInput;

    if (courseNew.active) {
        activeInput = activeChecked;
    } else {
        activeInput = activeUnchecked;
    }

    $courseTable.append(
        '<tr data-id="' + courseNew.id + '">' +
        '<th scope="row"><span class="noedit courseName">' + courseNew.name + '</span><input class="edit courseName" /></th>' +
        '<td><span class="noedit courseCredits">' + courseNew.credits + '</span><input class="edit courseCredits" /></td>' +
        '<td><span class="noedit courseTerm">' + courseNew.term + '</span><input class="edit courseTerm" /></td>' +
        '<td><span class="noedit courseYear">' + courseNew.year + '</span><input class="edit courseYear" /></td>' +
        '<td>' + activeInput + '</td>' +
        '<td class="buttonContainer"><button data-id="' + courseNew.id + '" class="editCourse noedit btn btn-info">Ändra</button>' +
        '<button data-id="' + courseNew.id + '" class="saveEdit edit btn btn-success">Spara</button>' +
        '<button data-id="' + courseNew.id + '" class="cancelEdit edit btn btn-warning">Avbryt</button>' +
        '<button data-id="' + courseNew.id + '" class="remove btn btn-danger">Ta bort</button></td>' +
        '</tr>'
    );

    $courseTable1.append(
        '<tr>' +
        '<th scope="row">' + courseNew.name + '</th>' +
        '<td>' + courseNew.credits + '</td>' +
        '<td>' + courseNew.term + '</td>' +
        '<td>' + courseNew.year + '</td>' +
        '<td>' + activeInput + '</td>' +
        '</tr>'
    );

} // appendCourse() end

$.ajaxSetup({ contentType: "application/json" }); // Set contentType to application/json for all $.ajax

// Get data from /api/courses database and output it into the table
$.get("/api/courses", function (data) {

    console.log(data);
    $.each(data, function (i, course) {
        appendCourse(course);
    });

});

// Post data from Ny Kurs inputs to database
$("#saveCourse").on("click", function () {

    if ($($courseActive).is(":checked")) {
        activeTrue = true;
    } else {
        activeTrue = false;
    }

    var course = {
        name: $courseName.val(),
        term: $courseTerm.val(),
        year: $courseYear.val(),
        credits: $coursePoints.val(),
        active: activeTrue
    };

    var courseJSON = JSON.stringify(course);

    console.log(course);

    $.ajax({
        type: "POST",
        url: "/api/courses",
        dataType: "json",
        data: courseJSON,
        success: function (newCourse) {
            appendCourse(newCourse);
            $("#createCourse").each(function () {
                this.reset();
            });
        }

    });

});

// Delete course from table and database
$courseTable.on("click", ".remove", function (e) {

    var confirmation = confirm("Are you sure you want to delete this course?");


    if (confirmation) {

        $.ajax({
            type: "DELETE",
            url: "/api/courses/" + $(this).attr("data-id"),
            success: function () {

                $courseTable.empty();
                $courseTable1.empty();

                $.get("/api/courses", function (data) {

                    console.log(data);
                    $.each(data, function (i, course) {
                        appendCourse(course);
                    });

                });

            }
        });

    } else {
        e.preventDefault();
    }
});

$courseTable.on("click", ".editCourse", function () {

    var $tr = $(this).closest("tr");
    var $btnId = $(this).attr("data-id");
    $tr.find("input.courseName").val($tr.find("span.courseName").html());
    $tr.find("input.courseCredits").val($tr.find("span.courseCredits").html());
    $tr.find("input.courseTerm").val($tr.find("span.courseTerm").html());
    $tr.find("input.courseYear").val($tr.find("span.courseYear").html());
    $tr.find("#courseActive" + $btnId).removeAttr("disabled");
    $tr.addClass("edit");

});

$courseTable.on("click", ".cancelEdit", function () {
    var $tr = $(this).closest("tr");
    var $btnId = $(this).attr("data-id");
    $tr.removeClass("edit");
    $tr.find("#courseActive" + $btnId).attr("disabled", "disabled");
});

$courseTable.on("click", ".saveEdit", function () {

    var $tr = $(this).closest("tr");
    var $btnId = $(this).attr("data-id");

    var activeControl;

    if ($("#courseActive" + $btnId).is(":checked")) {
        activeControl = true;
    } else {
        activeControl = false;
    }

    var course = {
        id: $tr.attr("data-id"),
        name: $tr.find("input.courseName").val(),
        credits: $tr.find("input.courseCredits").val(),
        term: $tr.find("input.courseTerm").val(),
        year: $tr.find("input.courseYear").val(),
        active: activeControl
    };

    var courseJSON = JSON.stringify(course);

    console.log(course);
    console.log(courseJSON);

    $.ajax({
        type: "PUT",
        url: "/api/courses/" + $tr.attr("data-id"),
        dataType: "json",
        data: courseJSON,
        contentType: "application/json",
        success: function (newCourse) {
            $courseTable.empty();
            $courseTable1.empty();

            $.get("/api/courses", function (data) {

                console.log(data);
                $.each(data, function (i, course) {
                    appendCourse(course);
                });

            });
        }

    });

    $tr.removeClass("edit");
    $tr.find("#courseActive" + $btnId).attr("disabled", "disabled");

});











































//------------------------------------------------------------------------------------------------------

var $dropdownListStudents = $("#dropdownListStudents");

$.get("/api/students", function (data) {
    //console.log(data);
    $.each(data, function (i, students) {

        $dropdownListStudents.append('<li class="dropdowns"><a href="#">' + students.firstName + ' ' + students.lastName + '</a></li>');

    });
});

var $dropdownListCourses = $("#dropdownListCourses");

$.get("/api/courses", function (data) {
    console.log(data);
    $.each(data, function (i, course) {

        $dropdownListCourses.append('<li class="dropdownsCourses dropdownCourses"><a href="#">' + course.name + '</a></li>');

    });
});

var $panelGenerator = $("#panelGenerator");

function getStudentsAndCourses(courses) {
    var looplength = courses.length;
    for (i = 0; i < looplength; i++) {



        $panelGenerator.append('<ul class="list-group">');
        $panelGenerator.append('<li class="list-group-item active">' + courses[i].name + '</li>');




        //studentlista för data[i]
        var studentcourse = courses[i].students;

        //loopa igenom varje student i varje kurs (data[i])
        studentcourse.forEach(function (linkedStudents) {
            $panelGenerator.append('<li class="list-group-item">' + linkedStudents.firstName + '</li>');
        });

        $panelGenerator.append('</ul>');



    }

    $panelGenerator.append('<br />');
}

$.get("/api/courses", function (courses) {
    getStudentsAndCourses(courses);


});

var studentIsSelceted = false; 
var courseIsSelceted = false; 
var selectedCourseNameStudentsArray;




$(document).on("click", "li.dropdownCourses a", function (e) {

    e.preventDefault(); // Eftersom vi klickar på a tagg som har en ankar länkar (#) så säger vi skit i o följa länken.
    var clickedCoursesName = $(this).html();
    console.log(clickedCoursesName);
    $('#displaySelectedStudent').empty();

    $.get("/api/courses", function (courses) {

        var looplength = courses.length;

        for (i = 0; i < looplength; i++) {

            var studentcourseCourse = courses;
            studentcourseCourse.forEach(function (studentCoursesName) {

                if (clickedCoursesName === courses[i].name) {
                    courseIsSelceted = true;
                    console.log(courses[i]);

                   

                    if (courseIsSelceted === true) {
                        $('#dropdownMenuButtonCourses').empty();
                        $('#dropdownMenuButtonCourses').append(clickedCoursesName);
                    }



                    selectedCourseId = courses[i].id;

                    console.log(selectedCourseId);




                    
                }


            });

        }
    var studentIsSelceted = false; 

       
    });
   


});



$(document).on("click", "li.dropdowns a", function (e) {
    e.preventDefault(); // Eftersom vi klickar på a tagg som har en ankar länkar (#) så säger vi skit i o följa länken.
    var clickedStudentName = $(this).html();
    $('#displaySelectedStudent').empty();

    $.get("/api/courses", function (courses) {
    

    var looplength = courses.length;
    for (i = 0; i < looplength; i++) {




        //studentlista för data[i]
        var studentcourse = courses[i].students;

        //loopa igenom varje student i varje kurs (data[i])
        studentcourse.forEach(function (linkedStudents) {



            if (clickedStudentName === linkedStudents.firstName || linkedStudents.lastName) {
                studentIsSelceted = true;
            }


        });

       
       
    }


     

        if (studentIsSelceted === true) {
            $('#dropdownMenuButtonStudents').empty();
            $('#dropdownMenuButtonStudents').append(clickedStudentName);

            

            $('#addStudentsEventButton').on("click", function (e) {
                console.log('************************************************');
                console.log('************************************************');
                console.log(clickedStudentName + ' är vald');

                $.get("/api/searchstudents/e", function (students) {
                  console.log(students);

                    $.each(students, function (i, data) {

                        var studentSearchedName = data.firstName + ' ' + data.lastName;

                        if (studentSearchedName === clickedStudentName) {
                            console.log(studentSearchedName);
                            var studentId = data.id;
                            var studentFirstName = data.firstName;
                            var studentLastName = data.lastName;
                            var studentSSN = data.ssn;
                            var studentActive = data.active;


                            var postStudent = {

                                courseId: selectedCourseId,
                                studentId: studentId

                            };
                        

                            var courseJSON = JSON.stringify(postStudent);
                            console.log('Loggar courseJSON: ' + courseJSON);

                            console.log('Student som ska POSTas: ' + postStudent);

                            $.ajax({
                                type: "POST",
                                contentType: 'application/json',
                                url: "/api/studentcourses/",
                                dataType: "json",
                                data: courseJSON,
                                success: function (Course) {
                                    alert('Det funkade');

                                    $("#panelGenerator").empty();

                                    $.get("/api/courses", function (courses) {
                                        getStudentsAndCourses(courses);
                                        resetDropdowns();
                                       
                                        

                                    });



                                }

                            });








                        }



                    });
                });

       
                   


            });



        }

        var studentIsSelceted = false; 
});
});



function resetDropdowns() {
    
        $('#dropdownMenuButtonStudents').empty();
        $('#dropdownMenuButtonStudents').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

        $('#dropdownMenuButtonCourses').empty();
        $('#dropdownMenuButtonCourses').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

   

}



$('#studentsAbort').on("click", function (e) {
    $('#dropdownMenuButtonStudents').empty();
    $('#dropdownMenuButtonStudents').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

    $('#dropdownMenuButtonCourses').empty();
    $('#dropdownMenuButtonCourses').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

});







   
