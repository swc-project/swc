var _x, _a, _a_b_c, _a_b, _a_b_c1, _a_b1, _a_b_c2, _this, _a1;
function f(a = (_x = x) == null ? void 0 : _x.y) {}
function g({ a, b = (_a = a) == null ? void 0 : _a.c }) {}
function h(a, { b = (_a_b_c = (_a_b = a.b) == null ? void 0 : _a_b.c) == null ? void 0 : _a_b_c.d.e }) {}
function i(a, { b = ((_a_b_c1 = (_a_b1 = a.b) == null ? void 0 : _a_b1.c) == null ? void 0 : _a_b_c1.d).e }) {}
function j(a, { b = (_this = (_a1 = a) == null ? void 0 : _a1.b) == null ? void 0 : ((_a_b_c2 = _this.c) == null ? void 0 : _a_b_c2.call(_this)).d.e }) {}
