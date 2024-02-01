function f() {
    return (function() {
        return x();
    })()(42);
}
