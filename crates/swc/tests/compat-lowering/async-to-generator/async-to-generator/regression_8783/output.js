(function poll() {
    return _async_to_generator(function*() {
        console.log((yield Promise.resolve('Hello')));
        setTimeout(poll, 1000);
    })();
})();
