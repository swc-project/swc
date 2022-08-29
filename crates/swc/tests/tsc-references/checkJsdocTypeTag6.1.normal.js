//// [test.js]
/** @type {number} */ function f() {
    return 1;
}
/** @type {{ prop: string }} */ var g = function g(prop) {};
/** @type {(a: number) => number} */ function add1(a, b) {
    return a + b;
}
/** @type {(a: number, b: number) => number} */ function add2(a, b) {
    return a + b;
}
// TODO: Should be an error since signature doesn't match.
/** @type {(a: number, b: number, c: number) => number} */ function add3(a, b) {
    return a + b;
}
// Confirm initializers are compatible.
// They can't have more parameters than the type/context.
/** @type {() => void} */ function funcWithMoreParameters(more) {} // error
/** @type {() => void} */ var variableWithMoreParameters = function variableWithMoreParameters(more) {}; // error
/** @type {() => void} */ var arrowWithMoreParameters = function(more) {}; // error
({
    /** @type {() => void} */ methodWithMoreParameters: function methodWithMoreParameters(more) {}
});
