(function() {
    // not void context
    // do not optimize
    1 + (function() {
        return 2;
    }());
}());
