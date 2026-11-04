var a = 1, b = 2;
var a = 1, b = 2;
var a = 1, b = 2, c = [
    3,
    4
];
var a = 1, b = 2, c = [
    3,
    4
];
var _ref = [
    1,
    2,
    3
], a = _ref[0], b = _ref[1];
var _ref1 = [
    1,
    2,
    3
], a = _ref1[0], b = _ref1[1];
var _ref2 = [
    a,
    b
], a = _ref2[0], b = _ref2[1];
var ref;
ref = [
    a[1],
    a[0]
], a[0] = ref[0], a[1] = ref[1], ref;
var _to_consumable_array_concat = _sliced_to_array(_to_consumable_array(foo).concat([
    bar
]), 2), a = _to_consumable_array_concat[0], b = _to_consumable_array_concat[1];
var _ref3 = [
    foo(),
    bar
], a = _ref3[0], b = _ref3[1];
var _ref4 = [
    clazz.foo(),
    bar
], a = _ref4[0], b = _ref4[1];
var _ref5 = [
    clazz.foo,
    bar
], a = _ref5[0], b = _ref5[1];
var a, b = 2;
a = 1, b = 2;
a = void 0, b = 2;
; // Avoid completion record special case
