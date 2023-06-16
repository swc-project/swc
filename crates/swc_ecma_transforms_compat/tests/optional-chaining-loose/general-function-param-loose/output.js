var _a, _a_b_c, _a_b, _a_b_c1, _a_b1, _a_b2, _a1;
function f(a = (()=>{
    var _x;
    return (_x = x) == null ? void 0 : _x.y;
})()) {}
function g({ a, b = (_a = a) == null ? void 0 : _a.c }) {}
function h(a, { b = (_a_b = a.b) == null ? void 0 : (_a_b_c = _a_b.c) == null ? void 0 : _a_b_c.d.e }) {}
function i(a, { b = ((_a_b1 = a.b) == null ? void 0 : (_a_b_c1 = _a_b1.c) == null ? void 0 : _a_b_c1.d).e }) {}
function j(a, { b = (_a1 = a) == null ? void 0 : (_a_b2 = _a1.b) == null ? void 0 : _a_b2.c().d.e }) {}
const k = function(a, b = (()=>{
    var _a;
    return (_a = a) == null ? void 0 : _a.b;
})()) {};
const l = (a, b = (()=>{
    var _a;
    return (_a = a) == null ? void 0 : _a.b;
})())=>{};
const m = {
    m (a, b = (()=>{
        var _a;
        return (_a = a) == null ? void 0 : _a.b;
    })()) {}
};
const n = class {
    n(a, b = (()=>{
        var _a;
        return (_a = a) == null ? void 0 : _a.b;
    })()) {}
};
const o = {
    set o (a = (()=>{
        var _b;
        return (_b = b) == null ? void 0 : _b.c;
    })()){}
};
