(function () {
    function load(value) { return value + 1; }
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
})();
console.log("sync", render() === render());
(function () {
    async function load(value) { return value + 1; }
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
})();
console.log("async", render() === render());
(function () {
    function* load(value) { yield value + 1; }
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
})();
console.log("generator", render() === render());
(function () {
    const load = value => value + 1;
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
})();
console.log("arrow", render() === render());
(function () {
    const load = async value => value + 1;
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
})();
console.log("asyncArrow", render() === render());
