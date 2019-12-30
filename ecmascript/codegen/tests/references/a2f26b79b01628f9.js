(function() {
    var a = 1; // should not hoist to parameter
    with (b)arguments = 2;
}());
