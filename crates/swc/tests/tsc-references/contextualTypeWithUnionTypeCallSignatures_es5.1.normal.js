// With no call signature | callSignatures
var x = function(a) {
    return a.toString();
};
// With call signatures with different return type
var x2 = function(a) {
    return a.toString();
}; // Like iWithCallSignatures
var x2 = function(a) {
    return a;
}; // Like iWithCallSignatures2
// With call signatures of mismatching parameter type
var x3 = function(a) {
    /*here a should be any*/ return a.toString();
};
// With call signature count mismatch
var x4 = function(a) {
    /*here a should be any*/ return a.toString();
};
