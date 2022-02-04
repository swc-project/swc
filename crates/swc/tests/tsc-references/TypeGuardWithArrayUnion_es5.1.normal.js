function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var Message = function Message() {
    "use strict";
    _classCallCheck(this, Message);
};
function saySize(message) {
    if (_instanceof(message, Array)) {
        return message.length; // Should have type Message[] here
    }
}
