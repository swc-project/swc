import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _to_property_key from "@swc/helpers/lib/_to_property_key.js";
// @target: es2015
var o = {
    a: 1,
    b: 'no'
};
var clone = _extends({}, o);
var { a  } = o, justB = _object_without_properties(o, [
    "a"
]);
var { a , b: renamed  } = o, empty = _object_without_properties(o, [
    "a",
    "b"
]);
var { ['b']: renamed  } = o, justA = _object_without_properties(o, [
    'b'
]);
var { 'b': renamed  } = o, justA = _object_without_properties(o, [
    'b'
]);
var { b: { '0': n , '1': oooo  }  } = o, justA = _object_without_properties(o, [
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
var _complex;
_complex = complex, nested = _object_without_properties(_complex.x, [
    "ka"
]), rest = _object_without_properties(_complex, [
    "x",
    "y"
]), ({ x: { ka  } , y: other  } = _complex), _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref, fresh = _object_without_properties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = _object_without_properties(_tmp, [
    "x"
]), ({ x  } = _tmp), _tmp;
class Removable {
    set z(value) {}
    get both() {
        return 12;
    }
    set both(value) {}
    m() {}
}
var removable = new Removable();
var { removed  } = removable, removableRest = _object_without_properties(removable, [
    "removed"
]);
var i = removable;
var { removed  } = i, removableRest2 = _object_without_properties(i, [
    "removed"
]);
let computed = 'b';
let computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key));
var _o;
_o = o, o = _object_without_properties(_o, [
    computed,
    computed2
].map(_to_property_key)), ({ [computed]: stillNotGreat , [computed2]: soSo  } = _o), _o;
var noContextualType = (_param)=>{
    var { aNumber =12  } = _param, notEmptyObject = _object_without_properties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
