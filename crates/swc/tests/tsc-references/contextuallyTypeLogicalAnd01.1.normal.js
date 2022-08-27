//// [contextuallyTypeLogicalAnd01.ts]
var x;
var y = true;
x = y && function(a) {
    return a;
};
