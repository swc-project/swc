class Base {
    constructor() {
        this.Foo = (function () {
            class _class {}
            var __ = {
                writable: true,
                value: (() => {
                    _class.foo = new.target;
                })(),
            };
            return _class;
        })();
    }
}
