import * as swcHelpers from "@swc/helpers";
var M1, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {
                swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "foo", 1, this, !0);
            }
        }
    ]), C;
}();
!function(M11) {
    var C;
    M11.M2 || (M11.M2 = {}), C = (function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
        }
        return swcHelpers.createClass(C, [
            {
                key: "foo",
                value: function() {
                    swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "foo", 1, this, !0);
                }
            }
        ]), C;
    })();
}(M1 || (M1 = {}));
