//// [privateNamesInNestedClasses-2.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
class A {
    constructor(){
        var _x = new WeakMap();
    }
}
var _x = {
    writable: !0,
    value: 5
};
