var Fwd = function(Fwd) {
    Fwd[Fwd["A"] = Later.baz] = "A";
    Fwd["B"] = "b";
    return Fwd;
}(Fwd || {});
(function(Later) {
    Later.baz = "u";
})(Later || (Later = {}));
(function(NotExported) {
    const hidden = "h";
})(NotExported || (NotExported = {}));
var Hid = function(Hid) {
    Hid[Hid["A"] = NotExported.hidden] = "A";
    Hid["B"] = "b";
    return Hid;
}(Hid || {});
(function(Mut) {
    Mut.m = "v";
})(Mut || (Mut = {}));
var MutE = function(MutE) {
    MutE[MutE["A"] = Mut.m] = "A";
    MutE["B"] = "b";
    return MutE;
}(MutE || {});
const objLit = {
    k: "w"
};
var Obj = function(Obj) {
    Obj[Obj["A"] = objLit.k] = "A";
    Obj["B"] = "b";
    return Obj;
}(Obj || {});
var H = function(H) {
    H[H["A"] = D2.c] = "A";
    H["B"] = "b";
    return H;
}(H || {});
(function(T) {
    T.typed = "annotated";
})(T || (T = {}));
var Typed = function(Typed) {
    Typed[Typed["A"] = T.typed] = "A";
    Typed["B"] = "b";
    return Typed;
}(Typed || {});
(function(Outer) {
    (function(Hidden) {
        Hidden.v = "h";
    })(Hidden || (Hidden = {}));
    var Hidden;
})(Outer || (Outer = {}));
var Nested = function(Nested) {
    Nested[Nested["A"] = Outer.Hidden.v] = "A";
    Nested["B"] = "b";
    return Nested;
}(Nested || {});
var Later, NotExported, Mut, T, Outer;
