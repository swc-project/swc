//// [generatorYieldContextualType.ts]
f1(function*() {
    return yield 0, 0;
}), f2(async function*() {
    return yield 0, 0;
});
var Directive, Directive1, Directive2 = ((Directive = Directive2 || {})[Directive.Back = 0] = "Back", Directive[Directive.Cancel = 1] = "Cancel", Directive[Directive.LoadMore = 2] = "LoadMore", Directive[Directive.Noop = 3] = "Noop", Directive);
(Directive1 = Directive2 || (Directive2 = {})).is = function(value) {
    return "number" == typeof value && null != Directive1[value];
}, (StepResult || (StepResult = {})).Break = Symbol("BreakStep");
