//// [functionImplementations.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function rec2() {
    return rec2();
}
function rec4() {
    return rec4();
}
rec2(), rec2(), rec4(), rec4();
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
new Base(), new Base();
