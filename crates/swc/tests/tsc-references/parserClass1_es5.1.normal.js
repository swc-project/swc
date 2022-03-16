import * as swcHelpers from "@swc/helpers";
export var NullLogger = /*#__PURE__*/ function() {
    "use strict";
    function NullLogger() {
        swcHelpers.classCallCheck(this, NullLogger);
    }
    var _proto = NullLogger.prototype;
    _proto.information = function information() {
        return false;
    };
    _proto.debug = function debug() {
        return false;
    };
    _proto.warning = function warning() {
        return false;
    };
    _proto.error = function error() {
        return false;
    };
    _proto.fatal = function fatal() {
        return false;
    };
    _proto.log = function log(s) {};
    return NullLogger;
}();
