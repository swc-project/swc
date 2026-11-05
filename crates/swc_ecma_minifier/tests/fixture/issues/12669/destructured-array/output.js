function load(value) {
    return value + 1;
}
globalThis.render = function(callbacks) {
    return function([callback = load] = []) {
        return callback;
    }(callbacks);
}, console.log(render() === render([]), render([]) === render([
    void 0
])), console.log(render([
    null
]), render([
    (value)=>2 * value
])(3));
