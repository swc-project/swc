import * as swcHelpers from "@swc/helpers";
var _class, _Foo;
var _foo = /*#__PURE__*/ new WeakMap(), _foo2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
class B {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: (_class = class {
                constructor(){
                    console.log("hello");
                }
            }, _class.test = 123, _class)
        });
        swcHelpers.classPrivateFieldInit(this, _foo2, {
            writable: true,
            value: (_Foo = class Foo {
            }, _Foo.otherClass = 123, _Foo)
        });
    }
}
