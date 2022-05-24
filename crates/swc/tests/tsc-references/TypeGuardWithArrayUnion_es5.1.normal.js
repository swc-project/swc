import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
var Message = function Message() {
    "use strict";
    _class_call_check(this, Message);
};
function saySize(message) {
    if (_instanceof(message, Array)) {
        return message.length; // Should have type Message[] here
    }
}
