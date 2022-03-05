import * as swcHelpers from "@swc/helpers";
// @declaration: true
// @declaration: true
function g() {
    var _C;
    var x = (_C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
            this.prop1 = 1;
        }
        swcHelpers.createClass(C, [
            {
                key: "foo",
                value: function foo() {}
            }
        ]);
        return C;
    }(), _C.prop2 = 43, _C);
}
