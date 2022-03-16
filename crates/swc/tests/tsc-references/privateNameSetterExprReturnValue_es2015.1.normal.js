import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2019
class C {
    bar() {
        let x = swcHelpers.classPrivateFieldSet(this, _foo, 42 * 2);
        console.log(x); // 84
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
}
function set_foo(a) {}
new C().bar();
