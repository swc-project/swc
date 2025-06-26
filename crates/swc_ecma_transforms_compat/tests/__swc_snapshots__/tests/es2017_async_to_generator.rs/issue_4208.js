function foo() {
    const bar = (baz = this.baz)=>_async_to_generator(function*() {
            console.log(this);
        }).call(this);
}
