import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _to_property_key from "@swc/helpers/lib/_to_property_key.js";
// @strict: true
// @target: es2015
const a = 'a';
function f1(obj) {
    let r0 = _extends({}, obj);
    let { a: a1  } = obj, r1 = _object_without_properties(obj, [
        "a"
    ]);
    let { a: a2 , b: b2  } = obj, r2 = _object_without_properties(obj, [
        "a",
        "b"
    ]);
    let { 'a': a3  } = obj, r3 = _object_without_properties(obj, [
        'a'
    ]);
    let { ['a']: a4  } = obj, r4 = _object_without_properties(obj, [
        'a'
    ]);
    let { [a]: a5  } = obj, r5 = _object_without_properties(obj, [
        a
    ].map(_to_property_key));
}
const sa = Symbol();
const sb = Symbol();
function f2(obj) {
    let { [sa]: a1 , [sb]: b1  } = obj, r1 = _object_without_properties(obj, [
        sa,
        sb
    ].map(_to_property_key));
}
function f3(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
function f4(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
