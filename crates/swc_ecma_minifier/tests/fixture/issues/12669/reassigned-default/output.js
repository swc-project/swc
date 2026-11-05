let load;
load = (value)=>value + 1, globalThis.render = function() {
    return function(callback = load) {
        return callback;
    }();
}, globalThis.replace = function(callback) {
    load = callback;
};
const first = render();
console.log(first(2), first === render());
const replacement = (value)=>2 * value;
replace(replacement), console.log(render() === replacement, render()(2), first(2));
