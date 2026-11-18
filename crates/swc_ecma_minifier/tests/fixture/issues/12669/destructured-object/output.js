function load(value) {
    return value + 1;
}
globalThis.render = function(options) {
    return function({ options: { callback = load } = {} } = {}) {
        return callback;
    }(options);
};
const first = render();
console.log(first === render({}), first === render({
    options: {}
})), console.log(render({
    options: {
        callback: null
    }
})), console.log(render({
    options: {
        callback: (value)=>2 * value
    }
})(3));
