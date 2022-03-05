import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "B",
            value: function() {
                return 42;
            }
        }
    ]), A;
}();
export { A as default };
