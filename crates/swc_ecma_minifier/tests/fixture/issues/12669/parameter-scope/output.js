function load() {
    return "outer";
}
globalThis.render = function(callback = load) {
    return [
        callback,
        "body"
    ];
};
const first = render(), second = render();
console.log(first[0] === second[0], first[0](), first[1]), console.log(render(()=>"override")[0]());
