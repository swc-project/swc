import * as swcHelpers from "@swc/helpers";
var C = // accessors are not contextually typed
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "x",
            get: function get() {
                return function(x) {
                    return "";
                };
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var c;
var r = c.x(''); // string
