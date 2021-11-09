// @target: es2015
class A {
    constructor(){
        _field.set(this, {
            writable: true,
            value: 10
        });
        _uninitialized.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _field = new WeakMap();
var _uninitialized = new WeakMap();
