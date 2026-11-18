function load(x) {
    return x + 1;
}
globalThis.render = function() {
    return function(cb = load) {
        return cb;
    }();
};
