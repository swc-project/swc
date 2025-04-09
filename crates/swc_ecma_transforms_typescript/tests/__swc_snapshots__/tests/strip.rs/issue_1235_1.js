class Service {
    is(a) {
        return /*#__PURE__*/ _async_to_generator(function*() {
            return a.toUpperCase() === a;
        })();
    }
}
(()=>/*#__PURE__*/ _async_to_generator(function*() {
        yield new Service().is('ABC');
    })())();
