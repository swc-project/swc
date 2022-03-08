import * as swcHelpers from "@swc/helpers";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B(a) {
        swcHelpers.classCallCheck(this, B);
        this.B = a;
    }
    var _proto = B.prototype;
    _proto.foo = function foo() {
        return this.x;
    };
    swcHelpers.createClass(B, [
        {
            key: "BB",
            get: function get() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function set(c) {
                this.B = c;
            }
        }
    ]);
    return B;
}();
