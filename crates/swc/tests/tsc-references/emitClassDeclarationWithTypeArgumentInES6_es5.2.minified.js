import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B(a) {
        swcHelpers.classCallCheck(this, B), this.B = a;
    }
    return B.prototype.foo = function() {
        return this.x;
    }, swcHelpers.createClass(B, [
        {
            key: "BB",
            get: function() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function(c) {
                this.B = c;
            }
        }
    ]), B;
}();
