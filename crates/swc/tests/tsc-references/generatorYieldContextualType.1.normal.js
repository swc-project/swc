//// [generatorYieldContextualType.ts]
f1(function*() {
    const a = yield 0;
    return 0;
});
f2(async function*() {
    const a = yield 0;
    return 0;
});
// repro from #41428
var Directive = /*#__PURE__*/ function(Directive) {
    Directive[Directive["Back"] = 0] = "Back";
    Directive[Directive["Cancel"] = 1] = "Cancel";
    Directive[Directive["LoadMore"] = 2] = "LoadMore";
    Directive[Directive["Noop"] = 3] = "Noop";
    return Directive;
}(Directive || {});
(function(Directive) {
    function is(value) {
        return typeof value === "number" && Directive[value] != null;
    }
    Directive.is = is;
})(Directive || (Directive = {}));
(function(StepResult) {
    StepResult.Break = Symbol("BreakStep");
})(StepResult || (StepResult = {}));
function canPickStepContinue(_step, _state, _selection) {
    return false;
}
function createPickStep(step) {
    return step;
}
function* showStep(state, _context) {
    const step = createPickStep({
        title: "",
        placeholder: ""
    });
    const selection = yield step;
    return canPickStepContinue(step, state, selection) ? selection[0] : StepResult.Break;
}
var StepResult;
