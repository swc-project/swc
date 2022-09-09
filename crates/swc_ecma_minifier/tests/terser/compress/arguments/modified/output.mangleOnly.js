(function (o, a) {
    var r = arguments[0];
    var n = arguments[1];
    var o = "foo";
    a++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(o, a, r, n, arguments[0], arguments[1]);
})("bar", 42);
