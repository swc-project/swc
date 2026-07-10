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

var p = new function(a = console.log(new.target.arguments.length)) {
}(undefined, "keep");

var q = new function(a = console.log(this.constructor.arguments.length)) {
}(undefined, "keep");

var r = new function F(a = console.log(F.arguments.length)) {
}(undefined, "keep");

var s = new function() {
    class C {
        [console.log(arguments.length)]() {}
    }
}("keep");

var t = new function F() {
    class C {
        [console.log(F.arguments.length)]() {}
    }
}("keep");

var u = new function() {
    class C {
        [console.log(this.constructor.arguments.length)]() {}
    }
}("keep");

var v = new function() {
    class C {
        [console.log(new.target.arguments.length)]() {}
    }
}("keep");

var w = new function(a = class C {
    [console.log(arguments.length)]() {}
}) {
}(undefined, "keep");

var x = new function() {
    class C extends (console.log(arguments.length), Object) {
    }
}("keep");
