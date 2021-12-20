// @declaration: true
// @target: es2015
class A {
    quux() {
    }
    constructor(){
        _foo.set(this, {
            writable: true,
            value: void 0
        });
        _bar.set(this, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
}
var _foo = new WeakMap();
var _bar = new WeakMap();
