//// [privateNameNestedClassMethodShadowing.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _x = new WeakSet();
class Base {
    constructor(){
        _class_private_method_init(this, _x);
        var _x1 = new WeakSet();
    }
}
function x() {}
