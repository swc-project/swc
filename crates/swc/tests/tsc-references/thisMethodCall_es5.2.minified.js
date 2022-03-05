import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "method",
            value: function() {}
        },
        {
            key: "other",
            value: function() {
                var _obj, ref;
                null === (ref = (_obj = this).method) || void 0 === ref || ref.call(_obj);
            }
        }
    ]), C;
}();
