class A {
    val = '1';
    foo() {
        return _async_to_generator(function*() {
            return yield ((x)=>_async_to_generator(function*() {
                    return x + this.val;
                }).call(this))('a');
        }).call(this);
    }
}
