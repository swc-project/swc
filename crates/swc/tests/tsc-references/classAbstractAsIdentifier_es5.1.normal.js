import * as swcHelpers from "@swc/helpers";
var abstract = /*#__PURE__*/ function() {
    "use strict";
    function abstract() {
        swcHelpers.classCallCheck(this, abstract);
    }
    swcHelpers.createClass(abstract, [
        {
            key: "foo",
            value: function foo() {
                return 1;
            }
        }
    ]);
    return abstract;
}();
new abstract;
