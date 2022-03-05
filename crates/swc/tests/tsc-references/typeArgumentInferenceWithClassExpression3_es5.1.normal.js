import * as swcHelpers from "@swc/helpers";
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function _class() {
        "use strict";
        swcHelpers.classCallCheck(this, _class);
    };
    return undefined;
}
foo(function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.prop = "hello";
}).length;
