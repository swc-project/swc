import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var Message = function Message() {
    "use strict";
    _class_call_check(this, Message);
};
function saySize(message) {
    if (_instanceof(message, Array)) {
        return message.length; // Should have type Message[] here
    }
}
