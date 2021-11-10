var _class, _class1;
// @target: es2015
class B {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: (_class = class _class {
                constructor(){
                    console.log("hello");
                }
            }, _class.test = 123, _class)
        });
        _foo2.set(this, {
            writable: true,
            value: (_class1 = class Foo {
            }, _class1.otherClass = 123, _class1)
        });
    }
}
var _foo = new WeakMap();
var _foo2 = new WeakMap();
