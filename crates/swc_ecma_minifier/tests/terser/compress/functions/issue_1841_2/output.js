var b = 10;
!(function (arg) {
    for (var key in "hi") arg.baz, (b = 42);
})(--b);
console.log(b);
