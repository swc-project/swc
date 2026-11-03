function deferred() {
    let Later = /*#__PURE__*/ function(Later) {
        Later[Later["A"] = 42] = "A";
        Later[Later["B"] = 43] = "B";
        return Later;
    }({});
    return 43;
}
var Before = function(Before) {
    Before[Before["A"] = seed] = "A";
    Before[Before["B"] = void 0] = "B";
    return Before;
}(Before || {});
const seed = 42;
var After = /*#__PURE__*/ function(After) {
    After[After["A"] = 42] = "A";
    After[After["B"] = 43] = "B";
    return After;
}(After || {});
function sameRegion() {
    let BeforeLocal = function(BeforeLocal) {
        BeforeLocal[BeforeLocal["A"] = local] = "A";
        BeforeLocal[BeforeLocal["B"] = void 0] = "B";
        return BeforeLocal;
    }({});
    const local = 7;
    let AfterLocal = /*#__PURE__*/ function(AfterLocal) {
        AfterLocal[AfterLocal["A"] = 7] = "A";
        AfterLocal[AfterLocal["B"] = 8] = "B";
        return AfterLocal;
    }({});
    return [
        BeforeLocal.A,
        8
    ];
}
(()=>{
    let Immediate = function(Immediate) {
        Immediate[Immediate["A"] = later] = "A";
        Immediate[Immediate["B"] = void 0] = "B";
        return Immediate;
    }({});
    return Immediate.B;
})();
const later = 5;
const first = second;
const second = 10;
var Chain = function(Chain) {
    Chain[Chain["A"] = first] = "A";
    Chain[Chain["B"] = void 0] = "B";
    return Chain;
}(Chain || {});
