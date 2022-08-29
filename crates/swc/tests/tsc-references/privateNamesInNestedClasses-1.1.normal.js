//// [privateNamesInNestedClasses-1.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
class A {
    method() {
        var _foo = /*#__PURE__*/ new WeakMap();
        class B {
            bar(a) {
                _class_private_field_get(a, _foo); // OK, no compile-time error, don't know what `a` is
            }
            baz(a) {
                _class_private_field_get(a, _foo); // compile-time error, shadowed
            }
            quux(b) {
                _class_private_field_get(b, _foo); // OK
            }
            constructor(){
                _class_private_field_init(this, _foo, {
                    writable: true,
                    value: "B's #foo"
                });
            }
        }
        const a = new A();
        new B().bar(a);
        new B().baz(a);
        const b = new B();
        new B().quux(b);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "A's #foo"
        });
        _class_private_field_init(this, _bar, {
            writable: true,
            value: "A's #bar"
        });
    }
}
new A().method();
