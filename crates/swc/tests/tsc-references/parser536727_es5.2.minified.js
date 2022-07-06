function foo(f) {
    return f("");
}
var g = function(x) {
    return x + "blah";
}, x = function() {
    return g;
};
foo(g), foo(function() {
    return g;
}), foo(x);
