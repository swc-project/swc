//// [prototypePropertyAssignmentMergedTypeReference.ts]
// https://github.com/microsoft/TypeScript/issues/33993
//// [prototypePropertyAssignmentMergedTypeReference.js]
var f = function f() {
    return 12;
};
f.prototype.a = "a";
/** @type {new () => f} */ var x = f;
