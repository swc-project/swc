var o = {
    _foo: null,
    set foo(o) {},
    get foo() {
        return this._foo;
    },
};
