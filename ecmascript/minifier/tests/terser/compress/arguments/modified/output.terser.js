(function (a, b) {
    var c = a;
    var d = b;
    var a = "foo";
    b++;
    a = "moo";
    b *= 2;
    console.log(a, b, c, d, a, b);
})("bar", 42);
