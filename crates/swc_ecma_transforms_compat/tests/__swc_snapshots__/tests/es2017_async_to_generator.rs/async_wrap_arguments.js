function foo() {
    const bar = ()=>_async_to_generator(function*() {
            return arguments;
        }).apply(this, arguments);
}
