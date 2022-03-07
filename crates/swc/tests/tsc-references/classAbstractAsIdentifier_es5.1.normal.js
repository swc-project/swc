import * as swcHelpers from "@swc/helpers";
var abstract = /*#__PURE__*/ function() {
    "use strict";
    function abstract() {
        swcHelpers.classCallCheck(this, abstract);
    }
    var _proto = abstract.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    return abstract;
}();
new abstract;
