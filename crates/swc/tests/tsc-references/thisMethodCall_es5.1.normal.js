import * as swcHelpers from "@swc/helpers";
var C = // @strict: true
// @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "method",
            value: function method() {}
        },
        {
            key: "other",
            value: function other() {
                var _obj, ref;
                (ref = (_obj = this).method) === null || ref === void 0 ? void 0 : ref.call(_obj);
            }
        }
    ]);
    return C;
}();
