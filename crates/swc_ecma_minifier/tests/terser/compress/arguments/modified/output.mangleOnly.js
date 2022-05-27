(function(a, b) {
    var c = arguments[0];
    var d = arguments[1];
    var a = "foo";
    b++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, b, c, d, arguments[0], arguments[1]);
})("bar", 42);
