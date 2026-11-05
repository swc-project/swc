(function () {
    const defaults = { count: 0 };
    function hook(state = defaults) { return state; }
    globalThis.render = function () { return hook(); };
})();
const first = render();
first.count++;
console.log(first === render(), render().count);
render().count++;
console.log(first.count);
