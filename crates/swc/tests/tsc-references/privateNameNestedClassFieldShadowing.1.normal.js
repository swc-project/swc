//// [privateNameNestedClassFieldShadowing.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _x = /*#__PURE__*/ new WeakMap();
class Base {
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        var _x1 = /*#__PURE__*/ new WeakMap();
        class Derived {
            testBase(x) {
                console.log(_class_private_field_get(x, _x1));
            }
            testDerived(x) {
                console.log(_class_private_field_get(x, _x1));
            }
            constructor(){
                _class_private_field_init(this, _x1, {
                    writable: true,
                    value: void 0
                });
            }
        }
    }
}
