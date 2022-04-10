import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.hello = function() {}, swcHelpers.createClass(C, [
        {
            key: "goodbye",
            get: function() {
                return 0;
            }
        }
    ]), C;
}();
