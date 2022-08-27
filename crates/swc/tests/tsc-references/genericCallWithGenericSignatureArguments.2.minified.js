//// [genericCallWithGenericSignatureArguments.ts]
var a, b;
function foo(a, b) {}
foo(function(x) {
    return 1;
}, function(x) {
    return "";
}), foo(function(x) {
    return null;
}, function(x) {
    return "";
}), foo(function(x) {
    return 1;
}, function(x) {
    return null;
}), foo(function(x) {
    return 1;
}, function(x) {
    return 1;
}), foo(function(x) {
    return a;
}, function(x) {
    return b;
}), foo(function(x) {
    return b;
}, function(x) {
    return a;
});
