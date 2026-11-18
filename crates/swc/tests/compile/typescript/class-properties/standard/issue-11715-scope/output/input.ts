const outer = "outer";
var Ambient = function(Ambient) {
    Ambient[Ambient["A"] = ambient] = "A";
    Ambient["B"] = "b";
    return Ambient;
}(Ambient || {});
function inFunction() {
    const inner = "inner";
    let Local = /*#__PURE__*/ function(Local) {
        Local["A"] = "inner";
        Local["B"] = "b";
        return Local;
    }({});
    return Local;
}
(function(NS) {
    const scoped = "scoped";
    (function(InNamespace) {
        InNamespace["A"] = "scoped";
        InNamespace["B"] = "b";
    })(NS.InNamespace || (NS.InNamespace = {}));
})(NS || (NS = {}));
var ShadowedOuter = /*#__PURE__*/ function(ShadowedOuter) {
    ShadowedOuter["A"] = "outer";
    ShadowedOuter["B"] = "b";
    return ShadowedOuter;
}(ShadowedOuter || {});
var NS;
