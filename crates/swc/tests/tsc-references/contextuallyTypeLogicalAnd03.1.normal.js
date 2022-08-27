//// [contextuallyTypeLogicalAnd03.ts]
var x;
var y = true;
x = function(a) {
    return a;
} && function(b) {
    return b;
};
