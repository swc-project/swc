import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: es2015
var a = 'a';
function f1(obj) {
    var r0 = swcHelpers.extends({}, obj);
    var a1 = obj.a, r1 = swcHelpers.objectWithoutProperties(obj, [
        "a"
    ]);
    var a2 = obj.a, b2 = obj.b, r2 = swcHelpers.objectWithoutProperties(obj, [
        "a",
        "b"
    ]);
    var a3 = obj['a'], r3 = swcHelpers.objectWithoutProperties(obj, [
        'a'
    ]);
    var a4 = obj['a'], r4 = swcHelpers.objectWithoutProperties(obj, [
        'a'
    ]);
    var a5 = obj[a], r5 = swcHelpers.objectWithoutProperties(obj, [
        a
    ].map(swcHelpers.toPropertyKey));
}
var sa = Symbol();
var sb = Symbol();
function f2(obj) {
    var a1 = obj[sa], b1 = obj[sb], r1 = swcHelpers.objectWithoutProperties(obj, [
        sa,
        sb
    ].map(swcHelpers.toPropertyKey));
}
function f3(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = swcHelpers.objectWithoutProperties(obj, [
        k1,
        k2
    ].map(swcHelpers.toPropertyKey));
}
function f4(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = swcHelpers.objectWithoutProperties(obj, [
        k1,
        k2
    ].map(swcHelpers.toPropertyKey));
}
