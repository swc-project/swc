(function () {
    function load() { return "outer"; }
    globalThis.render = function (callback = load) {
        function load() { return "body"; }
        return [callback, load()];
    };
})();
const first = render();
const second = render();
console.log(first[0] === second[0], first[0](), first[1]);
console.log(render(() => "override")[0]());
