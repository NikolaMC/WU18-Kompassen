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

$("#kurs_Slider").on("click", function () {

    $("#panel3").slideToggle();

    var icon = "<span class='glyphicon glyphicon-plus' aria-hidden='true'>";
    var $this = $(this);
    $this.toggleClass('open');

    var option1 = icon + ' Lägg till ny kurs';
    var option2 = ' Avbryt';

    if ($this.hasClass('open')) {
        $this.html(option1);
    } else {
        $this.html(option2);
    }

});

$("#btnClose").on("click", function () {

    $("#panel3").slideUp();

    $("#kurs_Slider").AddClass('open');

    //funkar inte

    if (!$('#kurs_Slider').hasClass('open')) {
        $('#kurs_Slider').addClass('open');
    }

});


// Get data from /api/courses database and output it into the table
var $courseTable = $("#coursesTable");


$.get("/api/courses", function (data) {
    //console.log(data);
    $.each(data, function (i, course) {
        $courseTable.append('<tr>');
        $courseTable.append('<th scope="row">' + course.name + '</th>');
        $courseTable.append('<td>' + course.credits + '</td>');
        $courseTable.append('<td>' + course.term + '</td>');

        if (course.active === true) {
            $courseTable.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
        } else {
            $courseTable.append('<td><input type="checkbox" disabled="disabled"></td>');
        }

        $courseTable.append('</tr>');
    });
});


var $coursesTableNewCourse = $("#coursesTableNewCourse");


$.get("/api/courses", function (data) {
    //console.log(data);
    $.each(data, function (i, course) {
        $coursesTableNewCourse.append('<tr>');
        $coursesTableNewCourse.append('<th scope="row">' + course.name + '</th>');
        $coursesTableNewCourse.append('<td>' + course.credits + '</td>');
        $coursesTableNewCourse.append('<td>' + course.term + '</td>');

        if (course.active === true) {
            $coursesTableNewCourse.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
        } else {
            $coursesTableNewCourse.append('<td><input type="checkbox" disabled="disabled"></td>');
        }

        $coursesTableNewCourse.append('</tr>');
    });
});



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



$.get("/api/courses", function (courses) {
    //console.log(data);

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


});

var studentIsSelceted = false; 
var courseIsSelceted = false; 
var selectedCourseNameStudentsArray;




$(document).on("click", "li.dropdownCourses a", function (e) {

    e.preventDefault() // Eftersom vi klickar på a tagg som har en ankar länkar (#) så säger vi skit i o följa länken.
    var clickedCoursesName = $(this).html();
    console.log(clickedCoursesName);
    $('#displaySelectedStudent').empty();

    $.get("/api/courses", function (courses) {

        var looplength = courses.length;

        for (i = 0; i < looplength; i++) {

            var studentcourseCourse = courses;
            studentcourseCourse.forEach(function (studentCoursesName) {

                if (clickedCoursesName == courses[i].name) {
                    courseIsSelceted = true;
                    console.log(courses[i]);

                   

                    if (courseIsSelceted == true) {
                        $('#dropdownMenuButtonCourses').empty();
                        $('#dropdownMenuButtonCourses').append(clickedCoursesName);
                    };



                    selectedCourseId = courses[i].id;

                    console.log(selectedCourseId);




                    
                }


            });

        };
    var studentIsSelceted = false; 

       
    });
   


});



$(document).on("click", "li.dropdowns a", function (e) {
    e.preventDefault() // Eftersom vi klickar på a tagg som har en ankar länkar (#) så säger vi skit i o följa länken.
    var clickedStudentName = $(this).html();
    $('#displaySelectedStudent').empty();

    $.get("/api/courses", function (courses) {
    

    var looplength = courses.length;
    for (i = 0; i < looplength; i++) {




        //studentlista för data[i]
        var studentcourse = courses[i].students;

        //loopa igenom varje student i varje kurs (data[i])
        studentcourse.forEach(function (linkedStudents) {



            if (clickedStudentName == linkedStudents.firstName || linkedStudents.lastName) {
                studentIsSelceted = true;
            }


        });

       
       
    }


     

        if (studentIsSelceted == true) {
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

                        if (studentSearchedName == clickedStudentName) {
                            console.log(studentSearchedName);
                            var studentId = data.id;
                            var studentFirstName = data.firstName;
                            var studentLastName = data.lastName;
                            var studentSSN = data.ssn;
                            var studentActive = data.active;


                            var postStudent = {
                                
                                courseId: selectedCourseId,
                                 studentId: studentId,
                                
                            }
                        

                            var courseJSON = JSON.stringify(postStudent);
                            console.log('Loggar courseJSON: ' + courseJSON)

                            console.log('Student som ska POSTas: ' + postStudent);

                            $.ajax({
                                type: "POST",
                                contentType: 'application/json',
                                url: "/api/studentcourses/",
                                dataType: "json",
                                data: courseJSON,
                                success: function (Course) {
                                    alert('Det funkade');

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



$('#studentsAbort').on("click", function (e) {
    $('#dropdownMenuButtonStudents').empty();
    $('#dropdownMenuButtonStudents').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

    $('#dropdownMenuButtonCourses').empty();
    $('#dropdownMenuButtonCourses').append(' <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  Studenter');

});










   
