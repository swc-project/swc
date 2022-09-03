//// [genericObjectRest.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
let a = 'a';
function f1(obj) {
    _extends({}, obj);
    let { a: a1  } = obj;
    _object_without_properties(obj, [
        "a"
    ]);
    let { a: a2 , b: b2  } = obj;
    _object_without_properties(obj, [
        "a",
        "b"
    ]);
    let { a: a3  } = obj;
    _object_without_properties(obj, [
        'a'
    ]);
    let { a: a4  } = obj;
    _object_without_properties(obj, [
        'a'
    ]);
    let { a: a5  } = obj;
    _object_without_properties(obj, [
        'a'
    ].map(_to_property_key));
}
let sa = Symbol(), sb = Symbol();
function f2(obj) {
    let { [sa]: a1 , [sb]: b1  } = obj;
    _object_without_properties(obj, [
        sa,
        sb
    ].map(_to_property_key));
}
function f3(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj;
    _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
function f4(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj;
    _object_without_properties(obj, [
        k1,
        k2
    ].map(_to_property_key));
}
