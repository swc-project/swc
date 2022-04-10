import * as swcHelpers from "@swc/helpers";
export var NullLogger = function() {
    function NullLogger() {
        swcHelpers.classCallCheck(this, NullLogger);
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
