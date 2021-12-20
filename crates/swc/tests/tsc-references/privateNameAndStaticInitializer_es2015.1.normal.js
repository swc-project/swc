// @target: esnext, es2015
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: 1
        });
        _prop.set(this, {
            writable: true,
            value: 2
        });
    }
}
var _foo = new WeakMap();
var _prop = new WeakMap();
A.inst = new A();
