(function(o, a) {
    var r = arguments[0];
    var v = arguments[1];
    var o = "foo";
    a++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(o, a, r, v, arguments[0], arguments[1]);
})("bar", 42);
