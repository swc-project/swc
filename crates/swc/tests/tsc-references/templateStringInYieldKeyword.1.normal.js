//// [templateStringInYieldKeyword.ts]
function* gen() {
    // Once this is supported, the inner expression does not need to be parenthesized.
    var x = yield `abc${x}def`;
}
