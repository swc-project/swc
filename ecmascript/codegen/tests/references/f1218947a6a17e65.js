(function() {
    var a = 1;
    (function() {
        // hoist this, but it is very difficult.
    (function () {
        eval('');
    }());
}());
