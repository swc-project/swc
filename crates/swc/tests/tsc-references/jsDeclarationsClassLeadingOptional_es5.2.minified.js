import * as swcHelpers from "@swc/helpers";
export var Z = function() {
    function Z() {
        swcHelpers.classCallCheck(this, Z);
    }
    return Z.prototype.f = function() {
        var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
        return [
            x,
            y
        ];
    }, Z;
}();
