var foo = function bar() {
    return _async_to_generator(function*() {
        console.log(bar);
    })();
};
