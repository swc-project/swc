import * as swcHelpers from "@swc/helpers";
var C10 = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C10), this.x = x, "string" == typeof this.x && "string" == typeof x && this.x;
}, C11 = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C11), this.x = x;
    var thisX_isString = "string" == typeof this.x, xIsString = "string" == typeof x;
    thisX_isString && xIsString ? (this.x, x) : (this.x = 10, x = 10);
};
({
    fn: function() {
        return !0;
    }
}).fn();
