//// [genericObjectRest.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
const a = 'a';
function f1(obj) {
    let {} = obj, r0 = _extends({}, obj);
    let { a: a1 } = obj, r1 = _object_without_properties(obj, [
        "a"
    ]);
    let { a: a2, b: b2 } = obj, r2 = _object_without_properties(obj, [
        "a",
        "b"
    ]);
    let { 'a': a3 } = obj, r3 = _object_without_properties(obj, [
        'a'
    ]);
    let { ['a']: a4 } = obj, r4 = _object_without_properties(obj, [
        'a'
    ]);
    let { [a]: a5 } = obj, r5 = _object_without_properties(obj, [
        _to_property_key(a)
    ]);
}
const sa = Symbol();
const sb = Symbol();
function f2(obj) {
    let { [sa]: a1, [sb]: b1 } = obj, r1 = _object_without_properties(obj, [
        sa,
        sb
    ].map(_to_property_key));
}
function f3(obj, k1, k2) {
    let { [k1]: a1, [k2]: a2 } = obj, r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
function f4(obj, k1, k2) {
    let { [k1]: a1, [k2]: a2 } = obj, r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
