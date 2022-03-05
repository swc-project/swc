import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    swcHelpers.createClass(_class, [
        {
            key: "foo",
            value: function foo() {
                return new C();
            }
        }
    ]);
    return _class;
}();
var x = (new C).foo();
