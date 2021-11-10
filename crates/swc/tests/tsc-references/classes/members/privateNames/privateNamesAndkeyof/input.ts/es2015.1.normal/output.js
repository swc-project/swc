// @strict: true
// @target: es6
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: 3
        });
        this.bar = 3;
        this.baz = 3;
    }
}
var _foo = new WeakMap();
