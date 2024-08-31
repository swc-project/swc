//// [functionImplementations.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function rec2() {
    return rec2();
}
function rec4() {
    return rec4();
}
rec2(), rec2(), rec4(), rec4();
var Base = function Base() {
    _class_call_check(this, Base);
};
new Base(), new Base();
