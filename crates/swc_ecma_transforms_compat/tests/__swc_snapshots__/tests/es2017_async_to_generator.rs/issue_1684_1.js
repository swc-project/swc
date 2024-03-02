const cache = {};
function getThing(key) {
    return _getThing.apply(this, arguments);
}
function _getThing() {
    _getThing = _async_to_generator(function*(key) {
        const it = cache[key] || (yield fetchThing(key));
        return it;
    });
    return _getThing.apply(this, arguments);
}
function fetchThing(key) {
    return Promise.resolve(key.toUpperCase()).then((val)=>cache[key] = val);
}
