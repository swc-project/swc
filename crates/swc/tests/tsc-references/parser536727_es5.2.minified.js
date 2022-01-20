function foo(f) {
    return f("");
}
var g = function(x) {
    return x + "blah";
};
foo(g), foo(function() {
    return g;
}), foo(function() {
    return g;
});
