//// [computedPropertyNames9_ES6.ts]
function f(x) {}
var v = {
    [f("")]: 0,
    [f(0)]: 0,
    [f(!0)]: 0
};
