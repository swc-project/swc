//// [contextualTypeWithTuple.ts]
// no error
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
new C(), new C(), new C(), new function D() {
    _class_call_check(this, D);
}();
