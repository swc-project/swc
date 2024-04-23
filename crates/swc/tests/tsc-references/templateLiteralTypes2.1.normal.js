//// [templateLiteralTypes2.ts]
function ft1(s, n, u, t) {
    var c1 = "abc".concat(s);
    var c2 = "abc".concat(n);
    var c3 = "abc".concat(u);
    var c4 = "abc".concat(t);
    var d1 = "abc".concat(s);
    var d2 = "abc".concat(n);
    var d3 = "abc".concat(u);
    var d4 = "abc".concat(t);
}
function ft2(s) {
    return "abc".concat(s);
}
function ft10(s) {
    var c1 = "abc".concat(s); // Type string
    var v1 = c1; // Type string
    var c2 = c1; // Type string
    var v2 = c2; // Type string
    var c3 = "abc".concat(s);
    var v3 = c3; // Type `abc${string}`
    var c4 = c1; // Type `abc${string}`
    var v4 = c4; // Type `abc${string}`
}
function ft11(s, cond) {
    var c1 = cond ? "foo".concat(s) : "bar".concat(s); // string
    var c2 = c1; // `foo${string}` | `bar${string}`
    var c3 = cond ? c1 : c2; // string
    var c4 = cond ? c3 : "baz".concat(s); // string
    var c5 = c4; // `foo${string}` | `bar${string}` | `baz${string}`
    var v1 = c1; // string
    var v2 = c2; // `foo${string}` | `bar${string}`
    var v3 = c3; // string
    var v4 = c4; // string
    var v5 = c5; // `foo${string}` | `bar${string}` | `baz${string}`
}
function ft12(s) {
    var c1 = "foo".concat(s);
    var v1 = c1;
    var c2 = "foo".concat(s);
    var v2 = c2;
    var c3 = "foo".concat(s);
    var v3 = c3;
    var c4 = "foo".concat(s);
    var v4 = c4;
    var c5 = "foo".concat(s);
    var v5 = c5;
}
function ft13(s, cond) {
    var x1 = widening("foo".concat(s));
    var x2 = widening(cond ? 'a' : "foo".concat(s));
    var y1 = nonWidening("foo".concat(s));
    var y2 = nonWidening(cond ? 'a' : "foo".concat(s));
}
function ft14(t) {
    var x1 = t;
    var x2 = t;
    var x3 = t;
    var x4 = t;
    var x6 = t;
}
function ft20(s) {
    var x1 = g1("xyz-".concat(s)); // string
    var x2 = g2("xyz-".concat(s)); // `xyz-${string}`
}
var t1 = takesLiteral("foo.bar.baz"); // "baz"
var id2 = "foo.bar.baz";
var t2 = takesLiteral(id2); // "baz"
var t3 = takesLiteral("foo.bar.".concat(someString)); // string
var id4 = "foo.bar.".concat(someString);
var t4 = takesLiteral(id4); // unknown
var t5 = takesLiteral("foo.bar.".concat(someUnion)); // "abc" | "def" | "ghi"
// Repro from #41732
var pixelValue = 22;
var pixelString = "22px";
var pixelStringWithTemplate = "".concat(pixelValue, "px");
// Repro from #43143
function getCardTitle(title) {
    return "test-".concat(title);
}
// Repro from #43424
var interpolatedStyle = {
    rotate: 12
};
function C2(transform) {
    return 12;
}
C2("rotate(".concat(interpolatedStyle.rotate, "dig)"));
