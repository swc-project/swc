(function(N) {
    (function(E) {
        E[E["A"] = 21] = "A";
        E[E["B"] = 22] = "B";
    })(N.E || (N.E = {}));
})(N || (N = {}));
const folded = 22;
const privateValue = 23;
var Kept = /*#__PURE__*/ function(Kept) {
    Kept[Kept["A"] = 24] = "A";
    Kept[Kept["B"] = 25] = "B";
    return Kept;
}(Kept || {});
const Live = Kept;
const object = Live;
(function(Exported) {
    let E = /*#__PURE__*/ function(E) {
        E[E["A"] = 25] = "A";
        E[E["B"] = 26] = "B";
        return E;
    }({});
    Exported.Live = E;
})(Exported || (Exported = {}));
var N, Exported;
