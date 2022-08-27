//// [destructuringObjectBindingPatternAndAssignment4.ts]
var ref = {}, _a = ref.a, a = _a === void 0 ? 1 : _a, _b = ref.b, b = _b === void 0 ? 2 : _b, _c = ref.c, c = _c === void 0 ? b : _c, _d = ref.d, d = _d === void 0 ? a : _d, _e = ref.e, e = _e === void 0 ? f : _e, _f = ref.f, f = _f === void 0 ? f // error
 : _f;
