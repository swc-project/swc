(function () {
    function load(value) { return value + 1; }
    function hook({ options: { callback = load } = {} } = {}) {
        return callback;
    }
    globalThis.render = function (options) { return hook(options); };
})();
const first = render();
console.log(first === render({}), first === render({ options: {} }));
console.log(render({ options: { callback: null } }));
console.log(render({ options: { callback: value => value * 2 } })(3));
