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

var i = new function(x) {
    console.log(x);
}(...xs, "keep");

var j = new function() {
    console.log(this.constructor.arguments.length);
}("keep");

var k = new function F() {
    console.log(F.arguments.length);
}("keep");

var l = new function F() {
    leak(F);
}("keep");

var m = new function() {
    leak(this);
}("keep");

var n = new function() {
    console.log(new.target.arguments.length);
}("keep");

var o = new function() {
    with (obj) {
        console.log(value);
    }
}("keep");
