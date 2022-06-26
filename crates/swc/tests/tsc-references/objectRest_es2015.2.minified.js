import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
var _complex, _tmp, _o, o = {
    a: 1,
    b: 'no'
};
_extends({}, o);
var { a  } = o;
_object_without_properties(o, [
    "a"
]);
var { a , b: renamed  } = o;
_object_without_properties(o, [
    "a",
    "b"
]);
var { b: renamed  } = o;
_object_without_properties(o, [
    'b'
]);
var { b: renamed  } = o;
_object_without_properties(o, [
    'b'
]);
var { b: { '0': n , '1': oooo  }  } = o;
_object_without_properties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed  } = o2;
_object_without_properties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest;
_extends({}, nestedrest.n1.n2.n3), _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex;
_object_without_properties(complex.x, [
    "ka"
]), _object_without_properties(complex, [
    "x",
    "y"
]), _object_without_properties((_complex = complex).x, [
    "ka"
]), _object_without_properties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref;
_object_without_properties(_ref, [
    "x"
]), _object_without_properties(_tmp = {
    x: 1,
    y: 2
}, [
    "x"
]), { x  } = _tmp;
var removable = new class {
    set z(value) {}
    get both() {
        return 12;
    }
    set both(value) {}
    m() {}
}(), { removed  } = removable;
_object_without_properties(removable, [
    "removed"
]);
var i = removable, { removed  } = i;
_object_without_properties(i, [
    "removed"
]);
let computed = 'b', computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key));
o = _object_without_properties(_o = o, [
    computed,
    computed2
].map(_to_property_key)), { [computed]: stillNotGreat , [computed2]: soSo  } = _o;
