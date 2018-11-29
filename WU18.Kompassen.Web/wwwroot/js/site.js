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
    console.log(data);
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



var $dropdownListStudents = $("#dropdownListStudents");

$.get("/api/students", function (data) {
    console.log(data);
    $.each(data, function (i, students) {

        $dropdownListStudents.append('<li class="dropdowns">' + students.firstName + ' ' +  students.lastName + '</li>');



    });
});




var $dropdownListCourses = $("#dropdownListCourses");

$.get("/api/courses", function (data) {
    console.log(data);
    $.each(data, function (i, course) {
    
        $dropdownListCourses.append('<li class="dropdowns">' + course.name + '</li>');
        

       
    });
});

