//// [typeArgumentInferenceErrors.ts]
function someGenerics1(n, m) {}
function someGenerics4(n, f) {}
function someGenerics5(n, f) {}
function someGenerics6(a, b, c) {}
someGenerics1(3, 4), someGenerics4("", function(x) {
    return "";
}), someGenerics5("", function(x) {
    return "";
}), someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
