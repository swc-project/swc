class A {
    constructor(){
        _foo.set(this, {
            writable: !0,
            value: 1
        }), _prop.set(this, {
            writable: !0,
            value: 2
        });
    }
}
var _foo = new WeakMap(), _prop = new WeakMap();
A.inst = new A();
