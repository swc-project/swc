//// [overloadResolution.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function fn1() {
    return null;
}
function fn3() {
    return null;
}
fn1(void 0), fn1({}), fn3(3), fn3("", 3, ""), fn3(5, 5, 5), fn3(4), fn3("", "", ""), fn3("", "", 3), fn3();
