(function () {
    const load = value => value + 1;
    function hook(callback = load) { return callback; }
    globalThis.first = function () { return hook(); };
})();
(function () {
    const load = value => value * 2;
    function hook(callback = load) { return callback; }
    globalThis.second = function () { return hook(); };
})();
console.log(first() === first(), second() === second());
console.log(first()(3), second()(3));
