import * as swcHelpers from "@swc/helpers";
var abstract = function() {
    "use strict";
    function abstract() {
        swcHelpers.classCallCheck(this, abstract);
    }
    return swcHelpers.createClass(abstract, [
        {
            key: "foo",
            value: function() {
                return 1;
            }
        }
    ]), abstract;
}();
new abstract;
