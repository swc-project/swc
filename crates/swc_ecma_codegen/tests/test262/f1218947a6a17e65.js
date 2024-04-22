(function() {
    var a = 1; // hoist this, but it is very difficult.
    (function() {
        eval('');
    }());
}());
