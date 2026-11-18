(function () {
    function load(value) { return value + 1; }
    function hook([callback = load] = []) { return callback; }
    globalThis.render = function (callbacks) { return hook(callbacks); };
})();
console.log(render() === render([]), render([]) === render([undefined]));
console.log(render([null]), render([value => value * 2])(3));
