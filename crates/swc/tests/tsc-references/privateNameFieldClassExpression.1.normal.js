//// [privateNameFieldClassExpression.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = /*#__PURE__*/ new WeakMap(), _foo2 = /*#__PURE__*/ new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: void 0
        });
        var _class, _Foo;
        _class_private_field_set(this, _foo, (_class = class {
            constructor(){
                console.log("hello");
            }
        }, _class.test = 123, _class));
        _class_private_field_set(this, _foo2, (_Foo = class Foo {
        }, _Foo.otherClass = 123, _Foo));
    }
}
