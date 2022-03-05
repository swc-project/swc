import * as swcHelpers from "@swc/helpers";
var X = function X() {
    "use strict";
    swcHelpers.classCallCheck(this, X);
};
X.x = 12 // Should error, incompatible with index signature
;
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        swcHelpers.classCallCheck(this, Y);
    }
    swcHelpers.createClass(Y, null, [
        {
            key: "foo",
            value: function foo() {} // should error, incompatible with index signature
        }
    ]);
    return Y;
}();
