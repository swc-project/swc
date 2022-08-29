//// [contextuallyTypeLogicalAnd02.ts]
var x;
var y = true;
x = y && function(a) {
    var b = a;
    return b;
};
