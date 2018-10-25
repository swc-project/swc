(function() {
    var // hoist this, but it is very difficult.a = 1;
    (function() {
        eval('');
    }());
}());
