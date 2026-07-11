var a = new function() {
    throw 1;
}("test");

var b = new function() {
    throw 1;
}(foo());

var c = new function() {
    throw 1;
}(...xs, "keep");

var d = new function(x) {
    throw 1;
}("keep", "extra");

var e = new function() {
    console.log(arguments.length);
}("keep");

var f = new function() {
    class C {
        [console.log(arguments.length)]() {}
    }
}("keep");

var g = new Foo("keep");
