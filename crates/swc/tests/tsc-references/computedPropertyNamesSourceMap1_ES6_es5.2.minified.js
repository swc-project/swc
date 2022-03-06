import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "hello",
            value: function() {}
        },
        {
            key: "goodbye",
            get: function() {
                return 0;
            }
        }
    ]), C;
}();
