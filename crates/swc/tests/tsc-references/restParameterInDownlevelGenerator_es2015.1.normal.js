// @target: es5
// @lib: es2015
// @downlevelIteration: true
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/30653
function* mergeStringLists(...strings) {
    for (var str of strings);
}
