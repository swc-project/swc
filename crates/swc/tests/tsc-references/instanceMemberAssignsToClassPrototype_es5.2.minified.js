import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        C.prototype.foo = function() {};
    }, _proto.bar = function(x1) {
        return C.prototype.bar = function() {}, C.prototype.bar = function(x) {
            return x;
        }, C.prototype.bar = function(x) {
            return 1;
        }, 1;
    }, C;
}();
