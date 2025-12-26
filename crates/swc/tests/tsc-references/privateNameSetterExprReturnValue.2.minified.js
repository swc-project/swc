//// [privateNameSetterExprReturnValue.ts]
var _foo = new WeakMap();
function set_foo(a) {}
new class {
    bar() {
        console.log(_foo.get(this).set.call(this, 84));
    }
    constructor(){
        _foo.set(this, {
            get: void 0,
            set: set_foo
        });
    }
}().bar();
