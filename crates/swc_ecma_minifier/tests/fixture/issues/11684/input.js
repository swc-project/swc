var a = new function() {
    throw 1;
}("test");

var b = new function() {
    throw 1;
}(foo());

var c = new function() {
    console.log(arguments[0]);
}("keep");

var d = new function() {
    eval("arguments[0]");
}("keep");

var e = new function(x) {
    console.log(x);
}("keep");

var f = new function() {
    throw 1;
}(...xs);

var g = new function(...args) {
    console.log(args.length);
}("keep", "also_keep");

var h = new Foo("keep");
