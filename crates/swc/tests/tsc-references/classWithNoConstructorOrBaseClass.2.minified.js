//// [classWithNoConstructorOrBaseClass.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    _class_call_check(this, C);
}();
var D = function D() {
    _class_call_check(this, D);
};
new D(), new D();
