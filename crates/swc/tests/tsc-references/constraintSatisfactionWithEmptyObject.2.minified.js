//// [constraintSatisfactionWithEmptyObject.ts]
// valid uses of a basic object constraint, no errors expected
// Object constraint
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C(x) {
    _class_call_check(this, C), this.x = x;
}({}), new function C2(x) {
    _class_call_check(this, C2), this.x = x;
}({});
