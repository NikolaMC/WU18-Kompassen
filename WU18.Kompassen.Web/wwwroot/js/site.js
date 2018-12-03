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