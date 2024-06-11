//// [generatorYieldContextualType.ts]
var Directive, StepResult, Directive1, Directive2;
f1(function*() {
    return yield 0, 0;
}), f2(async function*() {
    return yield 0, 0;
}), (Directive1 = Directive || (Directive = {}))[Directive1.Back = 0] = "Back", Directive1[Directive1.Cancel = 1] = "Cancel", Directive1[Directive1.LoadMore = 2] = "LoadMore", Directive1[Directive1.Noop = 3] = "Noop", (Directive2 = Directive || (Directive = {})).is = function(value) {
    return "number" == typeof value && null != Directive2[value];
}, (StepResult || (StepResult = {})).Break = Symbol("BreakStep");
