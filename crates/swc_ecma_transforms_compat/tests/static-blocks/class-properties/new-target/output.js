class Base {
    constructor(){
        var __ = new WeakMap(), _class;
        this.Foo = (_class = class {
        }, __.set(_class, {
            writable: true,
            value: this.foo = void 0
        }), _class);
    }
}
