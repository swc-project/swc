import * as swcHelpers from "@swc/helpers";
var tmp = this.bar(), C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.bar = function() {
        return 0;
    }, _proto[tmp] = function() {}, C;
}();
