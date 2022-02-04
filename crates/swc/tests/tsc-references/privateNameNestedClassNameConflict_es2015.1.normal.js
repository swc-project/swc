// @target: es2015
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: void 0
        });
        class A {
            constructor(){
                _foo1.set(this, {
                    writable: true,
                    value: void 0
                });
            }
        }
        var _foo1 = new WeakMap();
    }
}
var _foo = new WeakMap();
