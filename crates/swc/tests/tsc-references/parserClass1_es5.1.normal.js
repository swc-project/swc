function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
export var NullLogger = /*#__PURE__*/ function() {
    "use strict";
    function NullLogger() {
        _classCallCheck(this, NullLogger);
    }
    _createClass(NullLogger, [
        {
            key: "information",
            value: function information() {
                return false;
            }
        },
        {
            key: "debug",
            value: function debug() {
                return false;
            }
        },
        {
            key: "warning",
            value: function warning() {
                return false;
            }
        },
        {
            key: "error",
            value: function error() {
                return false;
            }
        },
        {
            key: "fatal",
            value: function fatal() {
                return false;
            }
        },
        {
            key: "log",
            value: function log(s) {
            }
        }
    ]);
    return NullLogger;
}();
