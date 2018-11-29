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

/*$("#btnClose").on("click", function () {

    $("#panel3").slideUp();

    $("#kurs_Slider").AddClass('open');

    //funkar inte

    if (!$('#kurs_Slider').hasClass('open')) {
        $('#kurs_Slider').addClass('open');
    }

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

    var activeChecked = '<input type="checkbox" checked="checked" disabled="disabled"></td>';
    var activeUnchecked = '<input type="checkbox" disabled="disabled">';
    var activeInput;

    if (courseNew.active) {
        activeInput = activeChecked;
    } else {
        activeInput = activeUnchecked;
    }

    $courseTable.append(
        '<tr>' +
            '<th scope="row">' + courseNew.name + '</th>' +
            '<td>' + courseNew.credits + '</td>' +
            '<td>' + courseNew.term + '</td>' +
            '<td>' + courseNew.year + '</td>' +
            '<td>' + activeInput + '</td>' +
            '<td><button data-id="' + courseNew.id + '" class="remove btn btn-danger">Ta bort</button></td>' +
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
$courseTable.on("click", ".remove", function () {

    //var $tr = $(this).closest("tr");

    $.ajax({
        type: "DELETE",
        url: "/api/courses/" + $(this).attr("data-id"),
        success: function () {

            //$($tr).remove();

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
});
