(function() {
    var a = 1; // should not hoist this
    arguments[2] = 3;
    (function() {
        eval('');
    }());
}());
