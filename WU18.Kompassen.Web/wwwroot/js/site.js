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
var $courseTable1 = $("#coursesTable1");
var $courseName = $("#kurser_Namn");
var $coursePoints = $("#kurser_Poäng");
var $courseYear = $("#kurser_År");
var $courseTerm = $("#kurser_Termin");
var $courseActive = $("#kurser_Aktiv");
var activeTrue;

$.get("/api/courses", function (data) {
    console.log(data);
    $.each(data, function (i, course) {
        $courseTable.append('<tr>');
        $courseTable.append('<th scope="row">' + course.name + '</th>');
        $courseTable.append('<td>' + course.credits + '</td>');
        $courseTable.append('<td>' + course.term + '</td>');
        $courseTable.append('<td>' + course.year + '</td>');

        if (course.active === true) {
            $courseTable.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
        } else {
            $courseTable.append('<td><input type="checkbox" disabled="disabled"></td>');
        }

        $courseTable.append('</tr>');

        $courseTable1.append('<tr>');
        $courseTable1.append('<th scope="row">' + course.name + '</th>');
        $courseTable1.append('<td>' + course.credits + '</td>');
        $courseTable1.append('<td>' + course.term + '</td>');
        $courseTable1.append('<td>' + course.year + '</td>');

        if (course.active === true) {
            $courseTable1.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
        } else {
            $courseTable1.append('<td><input type="checkbox" disabled="disabled"></td>');
        }

        $courseTable1.append('</tr>');
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
    console.log(courseJSON);

    $.ajax({
        type: "POST",
        url: "/api/courses",
        dataType: "json",
        data: courseJSON,
        contentType: "application/json",
        success: function (newCourse) {
            $courseTable.append('<tr>');
            $courseTable.append('<th scope="row">' + newCourse.name + '</th>');
            $courseTable.append('<td>' + newCourse.credits + '</td>');
            $courseTable.append('<td>' + newCourse.term + '</td>');
            $courseTable.append('<td>' + newCourse.year + '</td>');

            if (newCourse.active === true) {
                $courseTable.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
            } else {
                $courseTable.append('<td><input type="checkbox" disabled="disabled"></td>');
            }

            $courseTable.append('</tr>');

            $courseTable1.append('<tr>');
            $courseTable1.append('<th scope="row">' + newCourse.name + '</th>');
            $courseTable1.append('<td>' + newCourse.credits + '</td>');
            $courseTable1.append('<td>' + newCourse.term + '</td>');
            $courseTable1.append('<td>' + newCourse.year + '</td>');

            if (newCourse.active === true) {
                $courseTable1.append('<td><input type="checkbox" checked="checked" disabled="disabled"></td>');
            } else {
                $courseTable1.append('<td><input type="checkbox" disabled="disabled"></td>');
            }

            $courseTable1.append('</tr>');
        }
    });

});