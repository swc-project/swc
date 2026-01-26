//// [parser536727.ts]
function foo(f) {
    return f("");
}
var g = function g(x) {
    return x + "blah";
};
var x = function x() {
    return g;
};
foo(g);
foo(function() {
    return g;
});
foo(x);
