import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var NullLogger = function() {
    "use strict";
    function NullLogger() {
        _class_call_check(this, NullLogger);
    }
    var _proto = NullLogger.prototype;
    return _proto.information = function() {
        return !1;
    }, _proto.debug = function() {
        return !1;
    }, _proto.warning = function() {
        return !1;
    }, _proto.error = function() {
        return !1;
    }, _proto.fatal = function() {
        return !1;
    }, _proto.log = function(s) {}, NullLogger;
}();
