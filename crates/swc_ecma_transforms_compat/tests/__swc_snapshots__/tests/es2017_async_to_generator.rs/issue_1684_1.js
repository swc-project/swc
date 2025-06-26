const cache = {};
function getThing(key) {
    return _async_to_generator(function*() {
        const it = cache[key] || (yield fetchThing(key));
        return it;
    })();
}
function fetchThing(key) {
    return Promise.resolve(key.toUpperCase()).then((val)=>cache[key] = val);
}
