var a = 1,
    b = 2;
var a = 1,
    b = 2;
var a = 1,
    b = 2,
    c = [3, 4];
var a = 1,
    b = 2,
    c = [3, 4];
var _ref = [1, 2, 3],
    a = _ref[0],
    b = _ref[1];
var _ref2 = [1, 2, 3],
    a = _ref2[0],
    b = _ref2[1];
var _ref3 = [a, b],
    a = _ref3[0],
    b = _ref3[1];
var _ref4 = [a[1], a[0]];
a[0] = _ref4[0];
a[1] = _ref4[1];

var _ref5 = [].concat(babelHelpers.toConsumableArray(foo), [bar]),
    a = _ref5[0],
    b = _ref5[1];

var _ref6 = [foo(), bar],
    a = _ref6[0],
    b = _ref6[1];
var _ref7 = [clazz.foo(), bar],
    a = _ref7[0],
    b = _ref7[1];
var _ref8 = [clazz.foo, bar],
    a = _ref8[0],
    b = _ref8[1];
var a,
    b = 2;
a = 1;
b = 2;
a = void 0;
b = 2;
; // Avoid completion record special case
