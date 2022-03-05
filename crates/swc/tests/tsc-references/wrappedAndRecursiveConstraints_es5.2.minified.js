import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(data) {
        swcHelpers.classCallCheck(this, C), this.data = data;
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function(x) {
                return x;
            }
        }
    ]), C;
}();
new C(null).foo(null);
