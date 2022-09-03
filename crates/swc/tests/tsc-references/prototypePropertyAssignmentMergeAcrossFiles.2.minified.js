//// [prototypePropertyAssignmentMergeAcrossFiles.js]
function C() {
    this.a = 1;
}
//// [other.js]
C.prototype.foo = function() {
    return this.a;
};
