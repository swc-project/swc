class A {
    val = '1';
    foo() {
        return /*#__PURE__*/ _async_to_generator(function*() {
            try {
                return yield ((x)=>/*#__PURE__*/ _async_to_generator(function*() {
                        return x + this.val;
                    }).call(this))('a');
            } catch (e) {
                throw e;
            }
        }).call(this);
    }
}
