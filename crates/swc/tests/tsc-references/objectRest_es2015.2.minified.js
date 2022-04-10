import * as swcHelpers from "@swc/helpers";
var _complex, _tmp, _o, o = {
    a: 1,
    b: 'no'
};
swcHelpers.extends({}, o);
var { a  } = o;
swcHelpers.objectWithoutProperties(o, [
    "a"
]);
var { a , b: renamed  } = o;
swcHelpers.objectWithoutProperties(o, [
    "a",
    "b"
]);
var { b: renamed  } = o;
swcHelpers.objectWithoutProperties(o, [
    'b'
]);
var { b: renamed  } = o;
swcHelpers.objectWithoutProperties(o, [
    'b'
]);
var { b: { '0': n , '1': oooo  }  } = o;
swcHelpers.objectWithoutProperties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed  } = o2;
swcHelpers.objectWithoutProperties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest;
swcHelpers.extends({}, nestedrest.n1.n2.n3), swcHelpers.objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex;
swcHelpers.objectWithoutProperties(complex.x, [
    "ka"
]), swcHelpers.objectWithoutProperties(complex, [
    "x",
    "y"
]), _complex = complex, swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref;
swcHelpers.objectWithoutProperties(_ref, [
    "x"
]), _tmp = {
    x: 1,
    y: 2
}, swcHelpers.objectWithoutProperties(_tmp, [
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
swcHelpers.objectWithoutProperties(removable, [
    "removed"
]);
var i = removable, { removed  } = i;
swcHelpers.objectWithoutProperties(i, [
    "removed"
]);
let computed = 'b', computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = swcHelpers.objectWithoutProperties(o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey));
_o = o, o = swcHelpers.objectWithoutProperties(_o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey)), { [computed]: stillNotGreat , [computed2]: soSo  } = _o;
