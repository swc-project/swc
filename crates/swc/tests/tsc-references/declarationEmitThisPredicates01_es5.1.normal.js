import * as swcHelpers from "@swc/helpers";
// @declaration: true
// @module: commonjs
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "m",
            value: function m() {
                return swcHelpers._instanceof(this, D);
            }
        }
    ]);
    return C;
}();
export var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
