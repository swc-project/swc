class Service {
    is(a) {
        return _async_to_generator(function*() {
            return a.toUpperCase() === a;
        })();
    }
}
_async_to_generator(function*() {
    yield new Service().is('ABC');
})();
