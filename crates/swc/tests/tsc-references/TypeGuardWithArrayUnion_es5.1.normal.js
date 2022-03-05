import * as swcHelpers from "@swc/helpers";
var Message = function Message() {
    "use strict";
    swcHelpers.classCallCheck(this, Message);
};
function saySize(message) {
    if (swcHelpers._instanceof(message, Array)) {
        return message.length; // Should have type Message[] here
    }
}
