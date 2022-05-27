var a = {
    _foo: null,
    set foo (val){},
    get foo () {
        return this._foo;
    }
};
