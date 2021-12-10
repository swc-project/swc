function foo(f) {
    return f("");
}
var g = function(x1) {
    return x1 + "blah";
};
var x = function() {
    return g;
};
foo(g);
foo(function() {
    return g;
});
foo(x);
