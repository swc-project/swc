var _a_b_c, _a_b, _a_b_c1, _a_b1, _a_b2;
function f(a = x == null ? void 0 : x.y) {}
function g({ a, b: b1 = a == null ? void 0 : a.c }) {}
function h(a, { b: b1 = (_a_b = a.b) == null ? void 0 : (_a_b_c = _a_b.c) == null ? void 0 : _a_b_c.d.e }) {}
function i(a, { b: b1 = ((_a_b1 = a.b) == null ? void 0 : (_a_b_c1 = _a_b1.c) == null ? void 0 : _a_b_c1.d).e }) {}
function j(a, { b: b1 = a == null ? void 0 : (_a_b2 = a.b) == null ? void 0 : _a_b2.c().d.e }) {}
const k = function(a, b1 = a == null ? void 0 : a.b) {};
const l = (a, b1 = a == null ? void 0 : a.b)=>{};
const m = {
    m (a, b1 = a == null ? void 0 : a.b) {}
};
const n = class {
    n(a, b1 = a == null ? void 0 : a.b) {}
};
const o = {
    set o (a = b == null ? void 0 : b.c){}
};
