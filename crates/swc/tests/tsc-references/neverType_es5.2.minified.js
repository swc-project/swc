import * as swcHelpers from "@swc/helpers";
function error(message) {
    throw new Error(message);
}
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
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
function test(cb) {
    return cb();
}
test(function() {
    return "hello";
}), test(function() {
    return error("Something failed");
}), test(function() {
    throw new Error();
}), test(function() {
    return error("Error callback");
});
