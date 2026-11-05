(function () {
    let load = value => value + 1;
    function hook(callback = load) { return callback; }
    globalThis.render = function () { return hook(); };
    globalThis.replace = function (callback) { load = callback; };
})();
const first = render();
console.log(first(2), first === render());
const replacement = value => value * 2;
replace(replacement);
console.log(render() === replacement, render()(2), first(2));
