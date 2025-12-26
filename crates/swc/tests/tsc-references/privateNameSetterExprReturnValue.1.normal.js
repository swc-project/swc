//// [privateNameSetterExprReturnValue.ts]
var _foo = new WeakMap();
class C {
    bar() {
        var _this;
        let x = (_this = this, _foo.get(_this).set.call(_this, 42 * 2));
        console.log(x); // 84
    }
    constructor(){
        _foo.set(this, {
            get: void 0,
            set: set_foo
        });
    }
}
function set_foo(a) {}
new C().bar();
