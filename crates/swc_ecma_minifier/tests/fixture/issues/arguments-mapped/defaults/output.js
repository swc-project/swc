!function(a, b) {
    var c = a, d = b, a = "foo";
    b++, console.log(a = "moo", b *= 2, c, d, a, b);
}("bar", 42);
