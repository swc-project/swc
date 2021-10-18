function foo(f) {
    return f;
}
foo(function(x) {
    return x;
})("foo"), foo(function(x) {
    return x;
})("foo");
var h = function(f) {
    return f;
}(function(x) {
    return x;
});
h("foo"), h("bar");
