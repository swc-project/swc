// @strict: true
// @target: es6
// @strictPropertyInitialization: false
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
const b = new B(); // Error: Property #foo is missing
