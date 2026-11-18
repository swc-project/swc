const x = 7;
const hidden = 8;
const value = 9;
(function(N) {
    function f() {
        return N.x;
    }
    N.f = f;
})(N || (N = {}));
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 42] = "A";
    E[E["B"] = 43] = "B";
    return E;
}(E || {});
(function(Other) {
    function f() {
        return x + hidden;
    }
    Other.f = f;
})(Other || (Other = {}));
(function(Fallback) {
    function f() {
        return value;
    }
    Fallback.f = f;
})(Fallback || (Fallback = {}));
var N, Other, Fallback;
