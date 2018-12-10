








$('#addStudentSuccessMessage').hide();
$('#removeStudentSuccessMessage').hide();
$('#registeredStudentSuccessMessage').hide();
$('#courseCreatedSuccessMessage').hide(700);
$('#editButtonDropdown').hide();
$('#updateStudent').hide();

$('#updatedStudentSuccessMessage').hide();




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
    /*
    var checkedName;
    var checkedCredits;
    var checkedTerm;
    var checkedYear;

    if (courseNew.name === "") {
        checkedName = "N/A";
    } else {
        checkedName = courseNew.name;
    }

    if (courseNew.credits === "") {
        checkedCredits = "N/A";
    } else {
        checkedCredits = courseNew.credits;
    }

    if (courseNew.term === "") {
        checkedTerm = "N/A";
    } else {
        checkedTerm = courseNew.term;
    }

    if (courseNew.year === "") {
        checkedYear = "N/A";
    } else {
        checkedYear = courseNew.year;
    }
    */
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

    var checkedName;
    var checkedCredits;
    var checkedTerm;
    var checkedYear;

    if ($courseName.val() === "") {
        checkedName = "N/A";
    } else {
        checkedName = $courseName.val();
    }

    if ($coursePoints.val() === "") {
        checkedCredits = "N/A";
    } else {
        checkedCredits = $coursePoints.val();
    }
    //s
    if ($courseTerm.val() === "") {
        checkedTerm = "N/A";
    } else {
        checkedTerm = $courseTerm.val();
    }

    if ($courseYear.val() === "") {
        checkedYear = "N/A";
    } else {
        checkedYear = $courseYear.val();
    }

    var course = {
        name: checkedName,
        term: checkedTerm,
        year: checkedYear,
        credits: checkedCredits,
        active: activeTrue
    };

    var courseJSON = JSON.stringify(course);


    $.ajax({
        type: "POST",
        url: "/api/courses",
        dataType: "json",
        data: courseJSON,
        success: function (newCourse) {
            appendCourse(newCourse);

            $('#courseCreatedSuccessMessage').fadeIn(700);
            $('#courseCreatedSuccessMessage').fadeOut(7000);

            $("#createCourse").each(function () {
                this.reset();
            });

            $("#panelGenerator .row").empty();

            $.get("/api/courses", function (courses) {
                getStudentsAndCourses(courses);
            });

            $dropdownListCourses.empty();

            $.get("/api/courses", function (data) {
                $.each(data, function (i, course) {

                    $dropdownListCourses.append('<li class="dropdownsCourses dropdownCourses"><a href="#">' + course.name + '</a></li>');

                });
            });
        }
    });

});

// Delete course from table and database
$courseTable.on("click", ".remove", function (e) {

    var confirmation = confirm("Är du säker att du vill ta bort kursen?");


    if (confirmation) {

        $.ajax({
            type: "DELETE",
            url: "/api/courses/" + $(this).attr("data-id"),
            success: function () {

                $courseTable.empty();
                $courseTable1.empty();

                $.get("/api/courses", function (data) {

                    $.each(data, function (i, course) {
                        appendCourse(course);
                    });
                });

                $("#panelGenerator .row").empty();

                $.get("/api/courses", function (courses) {
                    getStudentsAndCourses(courses);
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

    var checkedName;
    var checkedCredits;
    var checkedTerm;
    var checkedYear;

    if ($tr.find("input.courseName").val() === "") {
        checkedName = "N/A";
    } else {
        checkedName = $tr.find("input.courseName").val();
    }

    if ($tr.find("input.courseCredits").val() === "") {
        checkedCredits = "N/A";
    } else {
        checkedCredits = $tr.find("input.courseCredits").val();
    }

    if ($tr.find("input.courseTerm").val() === "") {
        checkedTerm = "N/A";
    } else {
        checkedTerm = $tr.find("input.courseTerm").val();
    }

    if ($tr.find("input.courseYear").val() === "") {
        checkedYear = "N/A";
    } else {
        checkedYear = $tr.find("input.courseYear").val();
    }

    var course = {
        id: $tr.attr("data-id"),
        name: checkedName,
        credits: checkedCredits,
        term: checkedTerm,
        year: checkedYear,
        active: activeControl
    };

    var courseJSON = JSON.stringify(course);

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


    $.each(data, function (i, students) {

        getStudentsInDropdown(students);

    });

});

function getStudentsInDropdown(students) {
    $dropdownListStudents.append('<li class="dropdowns"><a href="#">' + students.firstName + '</a>' + ' ' + students.lastName + '</li>');
}




var $dropdownListCourses = $("#dropdownListCourses");

$.get("/api/courses", function (data) {
    $.each(data, function (i, course) {

        $dropdownListCourses.append('<li class="dropdownsCourses dropdownCourses"><a href="#">' + course.name + '</a></li>');

    });
});

var $panelGenerator = $("#panelGenerator .row");

function getStudentsAndCourses(courses) {
    var looplength = courses.length;
    for (var i = 0; i < looplength; i++) {

        var $div = $('<div class="col-lg-4"></div>');

        $div.append('<ul class="list-group">');

        // Här måste du hämta ut ul som du skapar ovanför och köra append på den för att lägga till li i den.
        $ulList = $div.find('.list-group');
        $ulList.append('<li class="list-group-item active">' + courses[i].name + '</li>');

        //studentlista för data[i]
        var studentcourse = courses[i].students;

        //loopa igenom varje student i varje kurs (data[i])
        studentcourse.forEach(function (linkedStudents) {
            $ulList.append('<li class="list-group-item">' + linkedStudents.firstName + ' ' + linkedStudents.lastName + '</li>');
        });

        $panelGenerator.append($div);

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
    $('#displaySelectedStudent').empty();
    $.get("/api/courses", function (courses) {
        var looplength = courses.length;
        for (i = 0; i < looplength; i++) {
            var studentcourseCourse = courses;
            studentcourseCourse.forEach(function (studentCoursesName) {
                if (clickedCoursesName === courses[i].name) {
                    courseIsSelceted = true;
                    if (courseIsSelceted === true) {
                        $('#dropdownMenuButtonCourses').empty();
                        $('#dropdownMenuButtonCourses').append(clickedCoursesName);
                    }
                    selectedCourseId = courses[i].id;
                }
            });
        }
        var studentIsSelceted = false;
    });
});


var clickedStudentName = null;


$(document).on("click", "li.dropdowns a", function (e) {
    e.preventDefault(); // Eftersom vi klickar på a tagg som har en ankar länkar (#) så säger vi skit i o följa länken.
    clickedStudentName = $(this).html();

    $('#displaySelectedStudent').empty();
    $('#editButtonDropdown').fadeIn(700);

    studentIsSelceted = true;

    if (studentIsSelceted === true) {
        $('#dropdownMenuButtonStudents').empty();
        $('#dropdownMenuButtonStudents').append(clickedStudentName);


    }
});


$('#addStudentsEventButton').on("click", function (e) {

    clickedStudentName;

    $.get("/api/searchstudents/" + clickedStudentName, function (student) {
        

        $.each(student, function (i, studendata) {




            var studentId = studendata;


            sendingStudentId = studentId.id;



        });

        var postStudent = {

            courseId: selectedCourseId,
            studentId: sendingStudentId

        };

        var courseJSON = JSON.stringify(postStudent);


        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "/api/studentcourses/",
            dataType: "json",
            data: courseJSON,
            success: function (Course) {

                $("#panelGenerator .row").empty();
                $('#registeredStudentSuccessMessage').fadeIn(700);
                $('#registeredStudentSuccessMessage').fadeOut(7000);

                $.get("/api/courses", function (courses) {
                    getStudentsAndCourses(courses);

                });
            }

        });
    });

});


$("#avregistreraStudent").on("click", function () {

    $.get("/api/searchstudents/" + clickedStudentName, function (student) {

        $.each(student, function (i, studendata) {

            var studentId = studendata;

            sendingStudentId = studentId.id;

        });

        var avregistreraStudent = {

            courseId: selectedCourseId,
            studentId: sendingStudentId

        };

        var studentJSON = JSON.stringify(avregistreraStudent);

        $.ajax({

            type: "DELETE",
            contentType: "application/json",
            url: "api/studentcourses",
            dataType: "json",
            data: studentJSON,
            success: function () {

                resetDropdowns();
                resetAfterAbort();
                $("#panelGenerator .row").empty();

                $.get("/api/courses", function (courses) {
                    getStudentsAndCourses(courses);
                });
            }

        });

    });

});

var studentIsSelceted = false;


function resetAfterAbort() {
    $('#updateStudent').hide();

    $('#editButtonDropdown').hide();

    document.getElementById('createStudentInput_Name').value = '';
    document.getElementById('createStudentInput_LastName').value = '';
    document.getElementById('createStudentInput_SSN').value = '';

}


function resetDropdowns() {

    $('#dropdownMenuButtonStudents').empty();
    $('#dropdownMenuButtonStudents').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

    $('#dropdownMenuButtonCourses').empty();
    $('#dropdownMenuButtonCourses').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Kurser');



}

$('#studentsAbort').on("click", function (e) {



    resetDropdowns();
    resetAfterAbort();


});


var createStudentInput_Name = $('#createStudentInput_Name');
var createStudentInput_LastName = $('#createStudentInput_LastName');
var createStudentInput_SSN = $('#createStudentInput_SSN');
var createStudentInput_Active;



$('#createStudentsAbort').on("click", function () {



    resetDropdowns();
    resetAfterAbort();

});






$('#createNewStudentBtn').on("click", function () {

    var checkBox = $('#createStudentInput_Active');

    if (checkBox.is(":checked")) {
        createStudentInput_Active = true;
    } else {
        createStudentInput_Active = false;
    }


    var createNewStudent = {

        firstname: createStudentInput_Name.val(),
        lastname: createStudentInput_LastName.val(),
        ssn: createStudentInput_SSN.val(),
        active: createStudentInput_Active

    };






    var newStudentJSON = JSON.stringify(createNewStudent);

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "/api/students",
        dataType: "json",
        data: newStudentJSON,
        success: function (Course) {

            createStudentInput_Name.empty();
            createStudentInput_LastName.empty();
            createStudentInput_SSN.empty();

            $('#addStudentSuccessMessage').fadeIn(700);
            $('#addStudentSuccessMessage').fadeOut(7000);

            // La till istället för {input fields} = "";, om något buggar kanske det är för detta?
            resetAfterAbort();


            $dropdownListStudents.empty();
            $.get("/api/students", function (data) {
                $.each(data, function (i, students) {

                    getStudentsInDropdown(students);

                });
            });



        }

    });



});




$('#avregistreraStudent').on("click", function () {
    $('#removeStudentSuccessMessage').fadeIn(700);
    $('#removeStudentSuccessMessage').fadeOut(7000);
});

var studentFirstNameForInput = null;
var studentLastNameForInput = null;
var studentSSNForInput = null;
var studentActiveForInput;

$('#editButtonDropdown').on("click", function () {

    $('#updateStudent').fadeIn(300);



    $.get("/api/searchstudents/" + clickedStudentName, function (student) {


        $.each(student, function (i, studendata) {

            var studentdata1 = studendata;


            studentId = studentdata1.id;
            studentFirstNameForInput = studentdata1.firstName;
            studentLastNameForInput = studentdata1.lastName;
            studentSSNForInput = studentdata1.ssn;
            studentActiveForInput = studentdata1.active;



        });

        document.getElementById('createStudentInput_Name').value = studentFirstNameForInput;
        document.getElementById('createStudentInput_LastName').value = studentLastNameForInput;
        document.getElementById('createStudentInput_SSN').value = studentSSNForInput;

        if (studentActiveForInput) {

            $("#createStudentInput_Active").attr("checked", "checked");
        } else {
            $('#createStudentInput_Active').prop('checked', false);
        }

        //document.getElementById('createStudentInput_Active') = studentActiveForInput;


    });

});



$('#updateStudentEventButton').on("click", function () {

    var createStudentInput_Active;

    if ($('#createStudentInput_Active').is(":checked")) {
        createStudentInput_Active = true;
    } else {
        createStudentInput_Active = false;
    }

    var firstNameInput = $('#createStudentInput_Name').val();
    var lastNameInput = $('#createStudentInput_LastName').val();
    var studentSSNInput = $('#createStudentInput_SSN').val();

    var postStudent = {
        id: studentId,
        firstName: firstNameInput,
        lastName: lastNameInput,
        ssn: studentSSNInput,
        active: createStudentInput_Active
    };

    var postStudentJSON = JSON.stringify(postStudent);


    $.ajax({
        type: "PUT",
        url: "/api/students/" + studentId,
        dataType: "json",
        contentTyp: "application/json",
        data: postStudentJSON,
        success: function () {


            $('#updatedStudentSuccessMessage').fadeIn(700);
            $('#updatedStudentSuccessMessage').fadeOut(7000);

            $dropdownListStudents.empty();

            $.get("/api/students", function (data) {


                $.each(data, function (i, students) {

                    getStudentsInDropdown(students);

                });

            });



        }
    });

    document.getElementById('createStudentInput_Name').value = '';
    document.getElementById('createStudentInput_LastName').value = '';
    document.getElementById('createStudentInput_SSN').value = '';

    $('#dropdownMenuButtonStudents').empty();
    $('#dropdownMenuButtonStudents').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

    $('#editButtonDropdown').hide();

    $('#updateStudent').hide();
});



