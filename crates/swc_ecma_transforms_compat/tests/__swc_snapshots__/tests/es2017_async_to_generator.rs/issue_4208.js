function foo() {
    const bar = (baz = this.baz)=>/*#__PURE__*/ _async_to_generator(function*() {
            console.log(this);
        }).call(this);
}
