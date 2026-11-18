const first = "a", second = first + "b";
var Chain = /*#__PURE__*/ function(Chain) {
    Chain["A"] = "ab";
    Chain["B"] = "aba";
    return Chain;
}(Chain || {});
function prime() {
    let Deferred = /*#__PURE__*/ function(Deferred) {
        Deferred["A"] = "later";
        return Deferred;
    }({});
    return Deferred;
}
function forward() {
    let Before = function(Before) {
        Before[Before["A"] = local] = "A";
        return Before;
    }({});
    const local = "local";
    return Before;
}
function cycle() {
    const a = b, b = a;
    let Cycle = function(Cycle) {
        Cycle[Cycle["A"] = a] = "A";
        return Cycle;
    }({});
    return Cycle;
}
function self() {
    const a = a;
    let Self = function(Self) {
        Self[Self["A"] = a] = "A";
        return Self;
    }({});
    return Self;
}
function typed() {
    let Before = function(Before) {
        Before[Before["A"] = local] = "A";
        return Before;
    }({});
    const local = "typed";
    return Before;
}
const later = "later";
var After = /*#__PURE__*/ function(After) {
    After["A"] = "later";
    return After;
}(After || {});
(function(N) {
    N.a = "namespace";
})(N || (N = {}));
(function(N) {
    N.b = N.a + "!";
    (function(E) {
        E["A"] = "namespace!";
    })(N.E || (N.E = {}));
})(N || (N = {}));
var N;
