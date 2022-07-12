// @target: es6
function f(x) {}
var v = {
    [f("")]: 0,
    [f(0)]: 0,
    [f(true)]: 0
};
