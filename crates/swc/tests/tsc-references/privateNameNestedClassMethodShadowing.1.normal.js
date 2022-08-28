//// [privateNameNestedClassMethodShadowing.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _x = /*#__PURE__*/ new WeakSet();
class Base {
    constructor(){
        _class_private_method_init(this, _x);
        var _x1 = /*#__PURE__*/ new WeakSet();
        class Derived {
            testBase(x1) {
                console.log(_class_private_method_get(x1, _x1, x));
            }
            testDerived(x1) {
                console.log(_class_private_method_get(x1, _x1, x));
            }
            constructor(){
                _class_private_method_init(this, _x1);
            }
        }
        function x() {}
    }
}
function x() {}
