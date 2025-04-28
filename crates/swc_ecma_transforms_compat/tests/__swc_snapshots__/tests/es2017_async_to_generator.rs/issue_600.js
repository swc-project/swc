function foo() {
    return _async_to_generator(function*() {
        for (let a of b){}
    })();
}
