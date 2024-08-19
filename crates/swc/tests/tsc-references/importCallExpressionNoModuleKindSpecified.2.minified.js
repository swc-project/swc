//// [0.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var B = /*#__PURE__*/ function() {
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
export function foo() {
    return "foo";
}
//// [1.ts]
export function backup() {
    return "backup";
}
//// [2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
