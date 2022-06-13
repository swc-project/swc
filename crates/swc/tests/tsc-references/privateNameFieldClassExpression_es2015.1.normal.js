import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _class, _Foo;
var _foo = /*#__PURE__*/ new WeakMap(), _foo2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
class B {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: (_class = class {
                constructor(){
                    console.log("hello");
                }
            }, _class.test = 123, _class)
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: (_Foo = class Foo {
            }, _Foo.otherClass = 123, _Foo)
        });
    }
}
