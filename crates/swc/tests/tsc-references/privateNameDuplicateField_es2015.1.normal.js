// @strict: true
// @target: es6
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: "foo"
        });
        _foo.set(this, {
            writable: true,
            value: "foo"
        });
    }
}
var _foo = new WeakMap();
var _foo = new WeakMap();
