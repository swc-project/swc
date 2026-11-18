let defaults;
defaults = {
    count: 0
}, globalThis.render = function() {
    return function(state = defaults) {
        return state;
    }();
};
const first = render();
first.count++, console.log(first === render(), render().count), render().count++, console.log(first.count);
