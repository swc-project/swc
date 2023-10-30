let Foo = _decorate([
    dec()
], function(_initialize) {
    class Foo {
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: Foo,
        d: []
    };
});
export { Foo as default };
