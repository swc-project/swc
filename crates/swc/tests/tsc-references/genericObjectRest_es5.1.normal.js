import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _to_property_key from "@swc/helpers/lib/_to_property_key.js";
// @strict: true
// @target: es2015
var a = "a";
function f1(obj) {
    var r0 = _extends({}, obj);
    var a1 = obj.a, r1 = _object_without_properties(obj, [
        "a"
    ]);
    var a2 = obj.a, b2 = obj.b, r2 = _object_without_properties(obj, [
        "a",
        "b"
    ]);
    var a3 = obj["a"], r3 = _object_without_properties(obj, [
        "a"
    ]);
    var a4 = obj["a"], r4 = _object_without_properties(obj, [
        "a"
    ]);
    var a5 = obj[a], r5 = _object_without_properties(obj, [
        a
    ].map(_to_property_key));
}
var sa = Symbol();
var sb = Symbol();
function f2(obj) {
    var a1 = obj[sa], b1 = obj[sb], r1 = _object_without_properties(obj, [
        sa,
        sb
    ].map(_to_property_key));
}
function f3(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
function f4(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
