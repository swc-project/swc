//// [privateNamesInNestedClasses-2.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
class A {
    constructor(){
        var _x = /*#__PURE__*/ new WeakMap();
        class B {
            constructor(){
                _class_private_field_init(this, _x, {
                    writable: true,
                    value: 5
                });
                class C {
                    constructor(){
                        _class_private_field_get(A, _x // error
                        );
                    }
                }
            }
        }
    }
}
var _x = {
    writable: true,
    value: 5
};
