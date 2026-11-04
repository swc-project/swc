let load, load;
load = (o)=>o + 1, globalThis.first = function() {
    return function(o = load) {
        return o;
    }();
}, load = (o)=>2 * o, globalThis.second = function() {
    return function(o = load) {
        return o;
    }();
}, console.log(first() === first(), second() === second()), console.log(first()(3), second()(3));
