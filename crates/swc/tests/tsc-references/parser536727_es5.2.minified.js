function foo(f) {
    return f("");
}
foo(function(x) {
    return x + "blah";
}), foo(function() {
    return function(x) {
        return x + "blah";
    };
}), foo(function() {
    return function(x) {
        return x + "blah";
    };
});
