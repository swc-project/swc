//// [objectRest.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
var _complex, _tmp, _o, o = {
    a: 1,
    b: 'no'
}, clone = _extends({}, o), { a  } = o, justB = _object_without_properties(o, [
    "a"
]), { a , b: renamed  } = o, empty = _object_without_properties(o, [
    "a",
    "b"
]), { b: renamed  } = o, justA = _object_without_properties(o, [
    'b'
]), { b: renamed  } = o, justA = _object_without_properties(o, [
    'b'
]), { b: { 0: n , 1: oooo  }  } = o, justA = _object_without_properties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed  } = o2, d = _object_without_properties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest, nr = _extends({}, nestedrest.n1.n2.n3), restrest = _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex, nested = _object_without_properties(complex.x, [
    "ka"
]), rest = _object_without_properties(complex, [
    "x",
    "y"
]);
_complex = complex, nested = _object_without_properties(_complex.x, [
    "ka"
]), rest = _object_without_properties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref, fresh = _object_without_properties(_ref, [
    "x"
]);
fresh = _object_without_properties(_tmp = {
    x: 1,
    y: 2
}, [
    "x"
]), { x  } = _tmp;
class Removable {
    set z(value) {}
    get both() {
        return 12;
    }
    set both(value) {}
    m() {}
}
var removable = new Removable(), { removed  } = removable, removableRest = _object_without_properties(removable, [
    "removed"
]), i = removable, { removed  } = i, removableRest2 = _object_without_properties(i, [
    "removed"
]);
let computed = 'b', computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key));
_o = o, o = _object_without_properties(_o, [
    computed,
    computed2
].map(_to_property_key)), { [computed]: stillNotGreat , [computed2]: soSo  } = _o;
var noContextualType = (_param)=>{
    var notEmptyObject, { aNumber =12  } = _param;
    return aNumber + _object_without_properties(_param, [
        "aNumber"
    ]).anythingGoes;
};
