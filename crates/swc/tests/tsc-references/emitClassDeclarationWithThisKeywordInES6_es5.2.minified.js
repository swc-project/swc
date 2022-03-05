import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B), this.x = 10, this.x = 10;
    }
    return swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function() {
                B.log(this.x);
            }
        },
        {
            key: "X",
            get: function() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function(y) {
                this.x = y;
            }
        }
    ], [
        {
            key: "log",
            value: function(a) {}
        }
    ]), B;
}();
