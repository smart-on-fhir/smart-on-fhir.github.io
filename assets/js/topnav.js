$(function() {
    var theTimer = 0;
    var theElement = null;
    var theLastPosition = {x:0,y:0};
    var delay = 200;

    $('[data-toggle]')
        .closest('li')

        .on('mouseenter', function (inEvent) {
            if (theElement) theElement.removeClass('open');
            window.clearTimeout(theTimer);
            theElement = $(this);

            theTimer = window.setTimeout(function() {
                theElement.addClass('open');
            }, delay);
        })

        .on('mousemove', function(inEvent) {
            if (Math.abs(theLastPosition.x - inEvent.ScreenX) > 4 ||
                Math.abs(theLastPosition.y - inEvent.ScreenY) > 4) {
                theLastPosition.x = inEvent.ScreenX;
                theLastPosition.y = inEvent.ScreenY;
                return;
            }

            if (theElement.hasClass('open')) return;

            window.clearTimeout(theTimer);
            theTimer = window.setTimeout(function () {
            theElement.addClass('open');
            }, delay);
        })

        .on('mouseleave', function (inEvent) {
            window.clearTimeout(theTimer);
            theElement = $(this);
            theTimer = window.setTimeout(function () {
                theElement.removeClass('open');
            }, delay);
        });
    });
