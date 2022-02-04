// @strict: true
// @target: es6
// @strictPropertyInitialization: false
// same as privateNamesUnique-1, but with an interface
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _foo = new WeakMap();
class B {
    constructor(){
        _foo1.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _foo1 = new WeakMap();
const b = new B();
