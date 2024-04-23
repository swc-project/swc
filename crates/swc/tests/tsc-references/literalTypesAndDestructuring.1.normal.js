//// [literalTypesAndDestructuring.ts]
var a1 = x.a;
var tmp = x.a, a2 = tmp === void 0 ? 0 : tmp;
var tmp1 = x.a, a3 = tmp1 === void 0 ? 2 : tmp1;
var tmp2 = x.a, a4 = tmp2 === void 0 ? 2 : tmp2;
var b1 = x.a;
var _x_a;
var b2 = (_x_a = x.a) !== null && _x_a !== void 0 ? _x_a : 0;
var _x_a1;
var b3 = (_x_a1 = x.a) !== null && _x_a1 !== void 0 ? _x_a1 : 2;
var _x_a2;
var b4 = (_x_a2 = x.a) !== null && _x_a2 !== void 0 ? _x_a2 : 2;
var _ref = {}, _ref_bar = _ref.bar, bar = _ref_bar === void 0 ? 'yo' : _ref_bar;
bar; // "yo" | "ha"
