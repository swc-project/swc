import * as swcHelpers from "@swc/helpers";
// @target: es5
// @sourceMap: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto["hello"] = function() {
        debugger;
    };
    swcHelpers.createClass(C, [
        {
            key: "goodbye",
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
