import * as swcHelpers from "@swc/helpers";
var A = function(map) {
    swcHelpers.classCallCheck(this, A), this.map = map;
}, B = function(A1) {
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.call(this, function(value) {
            return String(value.toExponential());
        });
    }
    return B;
}(A);
