var _a_b_c, _a_b, _a_b_c1, _a_b1, _a_b2;
function f(a1 = x == null ? void 0 : x.y) {}
function g({ a: a1, b: b1 = a1 == null ? void 0 : a1.c }) {}
function h(a1, { b: b1 = (_a_b = a1.b) == null ? void 0 : (_a_b_c = _a_b.c) == null ? void 0 : _a_b_c.d.e }) {}
function i(a1, { b: b1 = ((_a_b1 = a1.b) == null ? void 0 : (_a_b_c1 = _a_b1.c) == null ? void 0 : _a_b_c1.d).e }) {}
function j(a1, { b: b1 = a1 == null ? void 0 : (_a_b2 = a1.b) == null ? void 0 : _a_b2.c().d.e }) {}
const k = function(a1, b1 = a1 == null ? void 0 : a1.b) {};
const l = (a1, b1 = a1 == null ? void 0 : a1.b)=>{};
const m = {
    m (a1, b1 = a1 == null ? void 0 : a1.b) {}
};
const n = class {
    n(a1, b1 = a1 == null ? void 0 : a1.b) {}
};
const o = {
    set o (a = b == null ? void 0 : b.c){}
};
