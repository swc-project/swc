var _Base, __, _class, __1;
class Foo extends (_class = class extends (_Base = class Base {
}, __ = {
    writable: true,
    value: (()=>{
        _Base.qux = 21;
    })()
}, _Base) {
}, __1 = {
    writable: true,
    value: (()=>{
        _class.bar = 21;
    })()
}, _class) {
}
var __2 = {
    writable: true,
    value: (()=>{
        Foo.foo = Foo.bar + Foo.qux;
    })()
};
