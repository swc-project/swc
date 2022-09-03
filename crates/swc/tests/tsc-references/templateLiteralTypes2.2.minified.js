//// [templateLiteralTypes2.ts]
function ft1(s, n, u, t) {
    "abc".concat(s), "abc".concat(n), "abc".concat(u), "abc".concat(t), "abc".concat(s), "abc".concat(n), "abc".concat(u), "abc".concat(t);
}
function ft2(s) {
    return "abc".concat(s);
}
function ft10(s) {
    "abc".concat(s), "abc".concat(s);
}
function ft11(s, cond) {
    cond ? "foo".concat(s) : "bar".concat(s), cond || "baz".concat(s);
}
function ft12(s) {
    "foo".concat(s), "foo".concat(s), "foo".concat(s), "foo".concat(s), "foo".concat(s);
}
function ft13(s, cond) {
    widening("foo".concat(s)), widening(cond ? "a" : "foo".concat(s)), nonWidening("foo".concat(s)), nonWidening(cond ? "a" : "foo".concat(s));
}
function ft14(t) {}
function ft20(s) {
    g1("xyz-".concat(s)), g2("xyz-".concat(s));
}
var t1 = takesLiteral("foo.bar.baz"), id2 = "foo.bar.baz", t2 = takesLiteral(id2), t3 = takesLiteral("foo.bar.".concat(someString)), id4 = "foo.bar.".concat(someString), t4 = takesLiteral(id4), t5 = takesLiteral("foo.bar.".concat(someUnion)), pixelValue = 22, pixelString = "22px", pixelStringWithTemplate = "".concat(pixelValue, "px");
function getCardTitle(title) {
    return "test-".concat(title);
}
var interpolatedStyle = {
    rotate: 12
};
function C2(transform) {
    return 12;
}
C2("rotate(".concat(interpolatedStyle.rotate, "dig)"));
