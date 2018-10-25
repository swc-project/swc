(function() {
    var // should not hoist thisa = 1;
    arguments[2] = 3;
    (function() {
        eval('');
    }());
}());
