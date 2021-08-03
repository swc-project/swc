(function() {
    arguments[1] = 2;
    var a = 3; // should not hoist to parameter
}());
