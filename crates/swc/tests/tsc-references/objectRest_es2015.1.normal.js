import * as swcHelpers from "@swc/helpers";
// @target: es2015
var o = {
    a: 1,
    b: 'no'
};
var clone = swcHelpers.extends({}, o);
var { a  } = o, justB = swcHelpers.objectWithoutProperties(o, [
    "a"
]);
var { a , b: renamed  } = o, empty = swcHelpers.objectWithoutProperties(o, [
    "a",
    "b"
]);
var { ['b']: renamed  } = o, justA = swcHelpers.objectWithoutProperties(o, [
    'b'
]);
var { 'b': renamed  } = o, justA = swcHelpers.objectWithoutProperties(o, [
    'b'
]);
var { b: { '0': n , '1': oooo  }  } = o, justA = swcHelpers.objectWithoutProperties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed  } = o2, d = swcHelpers.objectWithoutProperties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest, nr = swcHelpers.extends({}, nestedrest.n1.n2.n3), restrest = swcHelpers.objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex, nested = swcHelpers.objectWithoutProperties(complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(complex, [
    "x",
    "y"
]);
var _complex;
_complex = complex, nested = swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), ({ x: { ka  } , y: other  } = _complex), _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref, fresh = swcHelpers.objectWithoutProperties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = swcHelpers.objectWithoutProperties(_tmp, [
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
var { removed  } = removable, removableRest = swcHelpers.objectWithoutProperties(removable, [
    "removed"
]);
var i = removable;
var { removed  } = i, removableRest2 = swcHelpers.objectWithoutProperties(i, [
    "removed"
]);
let computed = 'b';
let computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = swcHelpers.objectWithoutProperties(o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey));
var _o;
_o = o, o = swcHelpers.objectWithoutProperties(_o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey)), ({ [computed]: stillNotGreat , [computed2]: soSo  } = _o), _o;
var noContextualType = (_param)=>{
    var { aNumber =12  } = _param, notEmptyObject = swcHelpers.objectWithoutProperties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
