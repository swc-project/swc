import * as swcHelpers from "@swc/helpers";
export var Z = function() {
    "use strict";
    function Z() {
        swcHelpers.classCallCheck(this, Z);
    }
    return swcHelpers.createClass(Z, [
        {
            key: "f",
            value: function() {
                var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
                return [
                    x,
                    y
                ];
            }
        }
    ]), Z;
}();
