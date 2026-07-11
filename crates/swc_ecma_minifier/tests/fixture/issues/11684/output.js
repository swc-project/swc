new function() {
    throw 1;
}(), new function() {
    throw 1;
}(foo()), new function() {
    throw 1;
}(...xs, "keep"), new function(x) {
    throw 1;
}("keep", "extra"), new function() {
    console.log(arguments.length);
}("keep"), new function() {
    console.log(arguments.length);
}("keep"), new Foo("keep");
