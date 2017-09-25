/* eslint no-undef: "off" */
(function() {
    var forEach = Array.prototype.forEach;

    document.addEventListener('DOMContentLoaded', function() {
        forEach.call(document.querySelectorAll('.button'), function(button) {
            button.addEventListener('click', function(event) {
                event.target.classList.toggle('button_checked');
            });
        });
    });
}());
