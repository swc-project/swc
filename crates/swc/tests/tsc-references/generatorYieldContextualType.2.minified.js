//// [generatorYieldContextualType.ts]
f1(function*() {
    return yield 0, 0;
}), f2(async function*() {
    return yield 0, 0;
});
var Directive, Directive1, StepResult, Directive2 = ((Directive1 = Directive2 || {})[Directive1.Back = 0] = "Back", Directive1[Directive1.Cancel = 1] = "Cancel", Directive1[Directive1.LoadMore = 2] = "LoadMore", Directive1[Directive1.Noop = 3] = "Noop", Directive1);
(Directive = Directive2 || (Directive2 = {})).is = function(value) {
    return "number" == typeof value && null != Directive[value];
}, (StepResult || (StepResult = {})).Break = Symbol("BreakStep");
