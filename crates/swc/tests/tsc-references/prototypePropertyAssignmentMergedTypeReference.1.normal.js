//// [prototypePropertyAssignmentMergedTypeReference.ts]
//// [prototypePropertyAssignmentMergedTypeReference.js]
var f = function f() {
    return 12;
};
f.prototype.a = "a";
/** @type {new () => f} */ var x = f;
