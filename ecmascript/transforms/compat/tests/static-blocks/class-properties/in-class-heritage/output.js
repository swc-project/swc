class Foo extends (function () {
    class _class extends (function () {
        class Base {}
        var __ = {
            writable: true,
            value: (() => {
                Base.qux = 21;
            })(),
        };
        return Base;
    })() {}
    var __ = {
        writable: true,
        value: (() => {
            _class.bar = 21;
        })(),
    };
    return _class;
})() {}
var __ = {
    writable: true,
    value: (() => {
        Foo.foo = Foo.bar + Foo.qux;
    })(),
};
