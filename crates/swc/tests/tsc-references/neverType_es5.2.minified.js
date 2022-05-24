import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function error(message) {
    throw new Error(message);
}
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.void1 = function() {
        throw new Error();
    }, _proto.void2 = function() {
        for(;;);
    }, _proto.never1 = function() {
        throw new Error();
    }, _proto.never2 = function() {
        for(;;);
    }, C;
}();
(function(cb) {
    cb();
})(function() {
    return "hello";
}), function(cb) {
    cb();
}(function() {
    return error("Something failed");
}), function(cb) {
    cb();
}(function() {
    throw new Error();
}), function(cb) {
    cb();
}(function() {
    return error("Error callback");
});
