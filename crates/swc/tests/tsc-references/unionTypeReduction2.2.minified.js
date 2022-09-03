//// [unionTypeReduction2.ts]
function f1(x, y) {
    var z = x;
    z.f(), z.f("hello");
}
function f2(x, y) {
    var z = x;
    z.f(), z.f("hello");
}
function f3(x, y) {
    var f = x;
    f(), f("hello");
}
function f4(x, y) {
    var f = x;
    f(), f("hello");
}
function f5(x, y) {
    var f = x;
    f(), f("hello");
}
function f6(x, y) {
    var f = x;
    f(), f("hello");
}
function f11(a, b) {
    var z = a;
    z.f(), z.f("hello");
}
var k = {
    something: function() {}
};
function run(options) {
    var _something;
    (null !== (_something = options.something) && void 0 !== _something ? _something : val.something)("");
}
