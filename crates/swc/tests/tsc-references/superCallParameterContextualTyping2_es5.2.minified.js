import * as swcHelpers from "@swc/helpers";
var A = function(map) {
    swcHelpers.classCallCheck(this, A), this.map = map;
}, C = function(A1) {
    swcHelpers.inherits(C, A1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.call(this, function(value) {
            return String(value());
        });
    }
    return C;
}(A);
