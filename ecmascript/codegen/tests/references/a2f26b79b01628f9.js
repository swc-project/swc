(function() {
    var a = 1;
    with (// should not hoist to parameter
    with (b)// should not hoist to parameter
    with (b)
        arguments = 2;
}());
