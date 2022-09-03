//// [templateStringInYieldKeyword.ts]
function* gen() {
    var x = yield `abc${x}def`;
}
