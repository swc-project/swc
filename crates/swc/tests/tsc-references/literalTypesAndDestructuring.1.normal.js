//// [literalTypesAndDestructuring.ts]
var a1 = x.a;
var tmp = x.a, a2 = tmp === void 0 ? 0 : tmp;
var tmp1 = x.a, a3 = tmp1 === void 0 ? 2 : tmp1;
var tmp2 = x.a, a4 = tmp2 === void 0 ? 2 : tmp2;
var b1 = x.a;
var _a;
var b2 = (_a = x.a) !== null && _a !== void 0 ? _a : 0;
var _a1;
var b3 = (_a1 = x.a) !== null && _a1 !== void 0 ? _a1 : 2;
var _a2;
var b4 = (_a2 = x.a) !== null && _a2 !== void 0 ? _a2 : 2;
var ref = {}, _bar = ref.bar, bar = _bar === void 0 ? "yo" : _bar;
bar; // "yo" | "ha"
