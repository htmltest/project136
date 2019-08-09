$(document).ready(function() {

    $('.menu-catalogue-link').click(function(e) {
        $('html').toggleClass('menu-open');
        e.preventDefault();
    });

});