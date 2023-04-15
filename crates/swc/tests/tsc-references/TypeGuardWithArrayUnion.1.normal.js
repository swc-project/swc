//// [TypeGuardWithArrayUnion.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var Message = function Message() {
    "use strict";
    _class_call_check(this, Message);
};
function saySize(message) {
    if (_instanceof(message, Array)) {
        return message.length; // Should have type Message[] here
    }
}
